const { assert } = require("superstruct");
const app = require("../app");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
var router = express.Router();
const express = require('express');
const { CreateProductComment, PatchProductComment } = require('../dtos/comments.dto');

// 제품 댓글 생성 API
router.post('/create', async (req, res, next) => {
    try {
        assert(req.body, CreateProductComment);
        const { content } = req.body;
        const userId = Number(req.user.id);
        const productId = Number(req.params.productId);

        const comment = await prisma.productcomment.create({
            data: { content, userId, productId },
        });
        res.status(201).send({ id: comment.id });
    }
    catch (error) {
        next(error);
    }
}
);

// 제품 댓글 수정 API
router.patch('/:id', async (req, res, next) => {
    try {
        assert(req.body, PatchProductComment);

        const id = Number(req.params.id);
        const comment = await prisma.productcomment.update({
            where: { id },
            data: req.body,
        });
        res.status(200).send(comment);
    } catch (error) {
        next(error);
    };
})

// 제품 댓글 삭제 API
router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await prisma.productcomment.delete({
            where: { id },
        });
        res.statusCode(204).send()
    } catch (error) {
        next(error);
    }
});

// 댓글 목록 조회 API
router.get('/list', async (req, res, next) => {
    try {
        const pageSize = 10;
        const { lastId } = req.query;

        const queryOptions = {
            take: pageSize,
            orderBy: { id: 'desc' },
            select: { id: true, content: true, createdAt: true }
        };

        if (lastId) {
            const cursorId = Number(lastId);
            queryOptions.cursor = { id: cursorId };
            queryOptions.skip = 1;
        };

        const comments = await prisma.productcomment.findMany(queryOptions);

        const hasNextPage = comments.length === pageSize;

        let nextCursor = null;
        if (hasNextPage) {
            nextCursor = comments[comments.length - 1].id;
        };
        res.status(200).send({
            comments, nextCursor, hasNextPage
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        next(error);
    }
});

module.exports = router;