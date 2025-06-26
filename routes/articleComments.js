var express = require('express');
var router = express.Router();
const { passport } = require('../lib/passport/index.js');
const { assert } = require("superstruct");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ArticleComment } = require('../dtos/comments.dto');

router.post('/:articleId/create', passport.authenticate('access-token', { session: false }), createComment);
router.patch('/:commentId/update', passport.authenticate('access-token', { session: false }), updateComment);
router.delete('/:commentId', passport.authenticate('access-token', { session: false }), deleteComment);

//로그인한 사용자의 댓글 생성
async function createComment(req, res, next) {
    try {
        assert(req.body, ArticleComment);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid Comment data', errors: error.message });
    }

    const user = req.user;
    const articleId = Number(req.params.articleId);
    try {
        const article = await prisma.article.findUnique({
            where: { id: articleId },
        });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const { content } = req.body;
        const comment = await prisma.articleComment.create({
            data: { content, userId: user.id, articleId: article.id },
            select: { id: true, content: true, userId: true, articleId: true, createdAt: true }
        });
        res.status(201).json(comment);
    } catch (error) {
        console.error('Failed to create article comment:', error);
        next(error);
    }
}

//로그인한 사용자의 댓글 수정
async function updateComment(req, res, next) {
    try {
        assert(req.body, ArticleComment);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid Comment data', errors: error.message });
    }


    const user = req.user;
    const commentId = Number(req.params.commentId);
    try {
        const comment = await prisma.articleComment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            return res.status(404).json({ message: 'Article comment not found' });
        }
        if (comment.userId !== user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this comment.' });
        }


        const { content } = req.body;
        const updatedComment = await prisma.articleComment.update({
            where: { id: commentId },
            data: { content },
            select: { id: true, content: true, userId: true, articleId: true, createdAt: true }
        });
        res.status(201).json(updatedComment);
    } catch (error) {
        console.error('Failed to update article comment:', error);
        next(error);
    }
}

//로그인한 사용자의 댓글 삭제
async function deleteComment(req, res, next) {
    try {
        const commentId = Number(req.params.commentId)
        const user = req.user;

        const comment = await prisma.articleComment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this article comment.' });
        }

        await prisma.articleComment.delete({
            where: { id: commentId }
        })
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete article comment:', error);
        next(error);
    }
}

module.exports = router;