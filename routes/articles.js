var express = require('express');
var router = express.Router();
const { assert } = require("superstruct");
const app = require("../app");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { CreateArticle, PatchArticle } = require('../dtos/articles.dto');


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

    const where = title || content ? {
        OR: [
            { title: { contains: title || '', mode: 'insensitive' } },
            { content: { contains: content || '', mode: 'insensitive' } }
        ]
    } : {};

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

//게시글 등록 API
router.post('/create', async (req, res, next) => {
    try {
        assert(req.body, CreateArticle);
        const userId = Number(req.user.id);
        const { title, content } = req.body;

        const article = await prisma.$transaction(async (tx) => {
            const article = await tx.article.create({
                data: { title, content, userId },
            });
            return article;
        });
        res.status(201).json({ id: article.id });
    } catch (error) {
        console.error('Error creating article:', error);
        next(error);
    }
});

// 게시글 수정 API
router.patch('/:id', async (req, res, next) => {
    try {
        assert(req.body, PatchArticle);
        const id = Number(req.params.id);
        const article = await prisma.article.update({
            where: { id },
            data: req.body,
        });
        res.status(200).json(article);
    } catch (error) {
        console.error('Error updating article:', error);
        next(error);
    }
});

// 게시글 삭제 API
router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await prisma.product.delete({
            where: { id },
        })
        res.status(204).json();
    } catch (error) {
        console.error('Error deleting article:', error);
        next(error);
    }
})


module.exports = router;