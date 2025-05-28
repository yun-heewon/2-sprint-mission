const { assert } = require("superstruct");
const app = require("../app");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
var router = express.Router();
const express = require('express');
const { CreateArticleComment, PatchArticleComment } = require('../dtos/comments.dto');


router.post('/create', async (req, res, next) => {
    try {
        assert(req.body, CreateArticleComment);
        const { content } = req.body;
        const userId = Number(req.user.id);
        const articleId = Number(req.params.articleId);

        const comment = await prisma.articlecomment.create({
            data: { content, userId, articleId },
        });
        res.status(201).send({ id: comment.id });
    }
    catch (error) {
        next(error);
    }
}
);

router.patch('/:id', async (req, res, next) => {
    try {
        assert(req.body, PatchArticleComment);

        const id = Number(req.params.id);
        const comment = await prisma.articlecomment.update({
            where: { id },
            data: req.body,
        });
        res.status(200).send(comment);
    } catch (error) {
        next(error);
    };
})

router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await prisma.articlecomment.delete({
            where: { id },
        });
        res.statusCode(204).send()
    } catch (error) {
        next(error);
    }
});

//댓글 목록 조회 API
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

        const comments = await prisma.articlecomment.findMany(queryOptions);

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