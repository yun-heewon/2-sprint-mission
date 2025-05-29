var express = require('express');
var router = express.Router();
const { assert } = require("superstruct");
const app = require("../app");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { CreateArticleComment, PatchArticleComment } = require('../dtos/comments.dto');


//댓글 목록 조회 API, 커서 페이지네이션 사용
router.get('/list', async (req, res, next) => {
    try {
        // 페이지네이션 설정
        const pageSize = 10;
        const { lastId } = req.query;

        const queryOptions = {
            take: pageSize,
            orderBy: { id: 'desc' },
            select: { id: true, content: true, createdAt: true }
        };

        // lastId가 존재하면 커서 페이지네이션을 적용
        if (lastId) {
            const cursorId = Number(lastId);
            queryOptions.cursor = { id: cursorId };
            queryOptions.skip = 1;
        };

        // 댓글 목록 조회 
        const comments = await prisma.articleComment.findMany(queryOptions);

        //다음 페이지 여부 확인 
        const hasNextPage = comments.length === pageSize;

        // 다음 페이지 있을 시 커서 설정 
        let nextCursor = null;
        if (hasNextPage) {
            nextCursor = comments[comments.length - 1].id;
        };
        res.status(200).json({
            comments, nextCursor, hasNextPage
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        next(error);
    }
});

// 게시글 댓글 생성 API
router.post('/create', async (req, res, next) => {
    try {
        // 요청 본문 검증
        assert(req.body, CreateArticleComment);
        const { content } = req.body;

        // 사용자 ID와 게시글 ID 추출
        const userId = Number(req.user.id);
        const articleId = Number(req.params.articleId);

        // 게시글 존재 확인
        const article = await prisma.article.findUnique({
            where: { id: articleId }
        });
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        };

        // 게시글 댓글 생성
        const comment = await prisma.$transaction(async (tx) => {
            const comment = await tx.articleComment.create({
                data: { content, userId, articleId },
            });
            return comment;
        });
        res.status(201).json({ id: comment.id });
    } catch (error) {
        console.error('Error creating comment:', error);
        next(error);
    };
});


// 게시글 댓글 수정 API
router.patch('/:id', async (req, res, next) => {
    try {
        assert(req.body, PatchArticleComment);

        const id = Number(req.params.id);
        const comment = await prisma.articleComment.update({
            where: { id },
            data: req.body,
        });
        res.status(200).json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        next(error);
    };
})

// 게시글 댓글 삭제 API
router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await prisma.articleComment.delete({
            where: { id },
        });
        res.status(204).json();
    } catch (error) {
        console.error('Error deleting comment:', error);
        next(error);
    }
});


module.exports = router;