var express = require('express');
var router = express.Router();
const { CreateUser } = require('../dtos/users.dto');
const { assert } = require('superstruct');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = require('../app');


// user list 조회
router.get('/list', async (req, res, next) => {
  try {
    const { offset = 0, limit = 10 } = req.query;
    const users = await prisma.user.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
      select: { id: true, firstName: true, lastName: true, email: true, createdAt: true }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error);
  }
}
);

// user 생성
router.post('/create', async (req, res, next) => {
  try {
    assert(req.body, CreateUser);
    const { firstName, lastName, email } = req.body;

    const user = await prisma.user.create({
      data: { firstName, lastName, email },
    })
    res.status(201).json({ id: user.id });

  } catch (error) {
    console.error('Error creating user:', error);
    next(error);
  }
});

// user 수정
router.patch('/:id', async (req, res, next) => {
  try {
    assert(req.body, PatchUser);
    const id = Number(req.params.id);
    const { firstName, lastName, email } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({ id: user.id });
  } catch (error) {
    console.error('Error updating user:', error);
    next(error);
  }
}
);

//user 삭제 
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({
      where: { id },
    })
    res.status(204).json();
  } catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
})

module.exports = router;
