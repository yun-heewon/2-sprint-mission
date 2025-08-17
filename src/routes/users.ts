import express from 'express';
const router = express.Router();
import passport from '../lib/passport/index';
import upload from '../lib/upload';
import { getUser, register, login, patchUser, deleteUser, logout } from '../controllers/userController';
import { refreshTokens } from '../lib/token';
import { validateDto } from '../lib/validator';
import { CreateUserDto, PatchUserDto } from '../dtos/users.dto';

router.get('/me', passport.authenticate('access-token', { session: false }), getUser);
router.post('/register', upload.single('image'), validateDto(CreateUserDto), register);
router.post('/login', passport.authenticate('local', { session: false }), login);
router.post('/refresh', passport.authenticate('refresh-token', { session: false }), refreshTokens);
router.patch('/me', passport.authenticate('access-token', { session: false }), validateDto(PatchUserDto), patchUser);
router.delete('/:id', passport.authenticate('access-token', { session: false }), deleteUser);
router.post('/logout', logout);

export default router;