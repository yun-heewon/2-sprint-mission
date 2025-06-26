var express = require('express');
const { passport } = require('../lib/passport/index.js');
var router = express.Router();
const { assert } = require("superstruct");
const { CreateArticle, PatchArticle } = require('../dtos/articles.dto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/create', passport.authenticate('access-token', { session: false }), createArticle);
router.patch('/update/:id', passport.authenticate('access-token', { session: false }), updateArticle);
router.delete('/:id', passport.authenticate('access-token', { session: false }), deleteArticle);
router.get('/my-article', passport.authenticate('access-token', { session: false }), getArticleList)

//로그인한 사용자의 게시글 등록
async function createArticle(req, res, next) {
    try {
        assert(req.body, CreateArticle);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid Acticle data', errors: error.message });
    }

    const { title, content } = req.body;
    const user = req.user;

    try {
        const post = await prisma.article.create({
            data: { title, content, userId: user.id },
            select: { title: true, content: true, createdAt: true }
        });
        res.status(201).json(post);
    } catch (error) {
        console.error('Failed to create article:', error);
        next(error);
    }
}

//로그인한 사용자의 게시글 수정
async function updateArticle(req, res, next) {
    try {
        assert(req.body, PatchArticle);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid Acticle data', errors: error.message });
    }

    const { id } = req.params;
    const user = req.user;

    try {
        const article = await prisma.article.findUnique({
            where: { id: Number(id) }
        });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (article.userId !== user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this article.' });
        }

        const updatedArticle = await prisma.article.update({
            where: { id: Number(id) },
            data: req.body,
            select: { title: true, content: true, updatedAt: true }
        })
        res.status(200).json(updatedArticle);
    } catch (error) {
        console.error('Failed to update article:', error);
        next(error);
    }
}

//로그인한 사용자의 게시글 삭제
async function deleteArticle(req, res, next) {
    try {
        const { id } = req.params;
        const user = req.user;

        const article = await prisma.article.findUnique({ where: { id: Number(id) } });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (article.userId !== user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this article.' });
        }

        await prisma.article.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete article:', error);
        next(error);
    }
}

//로그인한 사용자가 작성한 게시글 목록
async function getArticleList(req, res, next) {
    const user = req.user;
    try {
        const { offset = 0, limit = 10, order = 'newest' } = req.query;
        let orderBy;
        switch (order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
        };

        const articles = await prisma.article.findMany({
            where: { userId: user.id },
            select: { id: true, title: true, content: true, createdAt: true },
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        res.status(200).json(articles);
    } catch (error) {
        console.error(`Error fetching user's articles:`, error);
        next(error);
    }
};

module.exports = router;