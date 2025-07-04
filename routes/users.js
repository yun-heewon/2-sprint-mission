var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const { CreateUser, PatchUser } = require('../dtos/users.dto');
const { assert } = require('superstruct');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('../lib/passport/index.js');
const { generateTokens } = require('../lib/token.js');
const { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } = require('../lib/constants.js');
const fs = require('fs');
const upload = require('../lib/upload.js');


router.get('/me', passport.authenticate('access-token', { session: false }), getUser);
router.post('/register', upload.single('image'), register);
router.post('/login', passport.authenticate('local', { session: false }), login);
router.post('/refresh', passport.authenticate('refresh-token', { session: false }), refreshTokens);
router.patch('/me', passport.authenticate('access-token', { session: false }), patchUser);
router.delete('/:id', passport.authenticate('access-token', { session: false }), deleteUser);
router.post('/logout', logout);

//정보 조회 
async function getUser(req, res, next) {
  try {
    const users = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, nickname: true, createdAt: true }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching user:', error);
    next(error);
  }
}

//회원가입 
async function register(req, res, next) {
  try {
    assert(req.body, CreateUser);
  } catch (error) {
    console.error('Validation Error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.warn(`Rolled back uploaded file due to validation error: ${req.file.path}`);
    }
    return res.status(400).json({ message: 'Invalid registration data', errors: error.message });
  }

  const { email, nickname, password } = req.body;
  let imageFilename = null;

  if (req.file) {
    imageFilename = req.file.filename;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await prisma.user.create({
      data: { email, nickname, password: hashedPassword, image: imageFilename },
      select: { id: true, email: true, nickname: true, image: true, createdAt: true }
    });
    const profileImageUrl = imageFilename ? `/uploads/${imageFilename}` : null;
    res.status(201).json({
      message: 'User registered successfully',
      user: user,
      profileImageUrl: profileImageUrl
    });
  } catch (error) {
    console.error('Failed to register user', error);

    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email or User nickname already exist! Please Change to something else ' });
    }

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.warn(`Rolled back uploaded file due to unexpected error: ${req.file.path}`);
    }

    next(error);
  }
}

//로그인
async function login(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { accessToken, refreshToken } = generateTokens(req.user.id)
  setTokenCookies(res, accessToken, refreshToken);
  res.status(200).json();

}

//회원정보 수정 
async function patchUser(req, res) {
  const loggedInUser = req.user.id
  try {
    assert(req.body, PatchUser);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid update data', errors: erro.message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: loggedInUser },
      data: req.body,
      select: { id: true, email: true, nickname: true, image: true }
    });
    res.status(200).json({ message: 'User updated successfully!', user: updatedUser })
  } catch (error) {
    console.error('Failed to update user', error);

    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email or User nickname already exist! Please Change to something else ' });
    }
    res.status(500).json({ message: 'Failed to update user information.' });
  }
}

//user 삭제 
async function deleteUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const user = req.user;

    if (id !== user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this account.' });
    }

    await prisma.user.delete({
      where: { id },
    })
    res.status(204).send();
} catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
}

function logout(req, res) {
  clearTokenCookies(res);
  res.status(200).send();
}

//브라우저 쿠키에 토큰 저장 
function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    maxAge: 1 * 60 * 60 * 1000,
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    maxAge: 1 * 24 * 60 * 60 * 1000,
    path: '/refresh',
  });
}

//만료 토큰 갱신 
async function refreshTokens(req, res) {
  const user = req.user;
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    user.id
  );
  setTokenCookies(res, accessToken, newRefreshToken);
  res.status(200).send();
};

function clearTokenCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}


module.exports = router;
