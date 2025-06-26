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

/*title, content 필터링 기능을 포함한 제품 목록 조회 API,
offset 방식의 페이지네이션, 
최신순으로 정렬 기능*/
router.get('/list', async (req, res, next) => {
    let orderBy;
    const { offset = 0, limit = 10, order = 'newest', title, content } = req.query;
    switch (order) {
        case 'oldest':
            orderBy = { createdAt: 'asc' };
            break;
        case 'newest':
        default:
            orderBy = { createdAt: 'desc' };
    };

    //
    const searchParams = [];
    if (title) {
        searchParams.push({ title: { contains: title, mode: 'insensitive' } });
    }
    if (content) {
        searchParams.push({ content: { contains: content, mode: 'insensitive' } });
    }
    const where = searchParams.length > 0 ? { OR: searchParams } : {};

    try {
        const articles = await prisma.article.findMany({
            where,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            select: { id: true, title: true, content: true, createdAt: true }
        });
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        next(error);
    }
});

// 게시글 ID를 파라미터로 받아 해당 게시글의 상세 정보를 조회하는 API
router.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const article = await prisma.article.findUnique({
            where: { id },
            select: { id: true, title: true, content: true, createdAt: true }
        });
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        next(error);
    }
});



module.exports = router;