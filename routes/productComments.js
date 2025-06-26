var express = require('express');
var router = express.Router();
const { assert } = require("superstruct");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ProductComment } = require('../dtos/comments.dto');

router.post('/:productId/create', passport.authenticate('access-token', { session: false }), createComment);
router.patch('/:commentId/update', passport.authenticate('access-token', { session: false }), updateComment);
router.delete('/:commentId', passport.authenticate('access-token', { session: false }), deleteComment);

//로그인한 사용자의 댓글 생성
async function createComment(req, res, next) {
    try {
        assert(req.body, ProductComment);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid Comment data', errors: error.message });
    }

    const user = req.user;
    const productId = Number(req.params.productId);
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { content } = req.body;
        const comment = await prisma.productComment.create({
            data: { content, userId: user.id, productId: product.id },
            select: { id: true, content: true, userId: true, productId: true, createdAt: true }
        });
        res.status(201).json(comment);
    } catch (error) {
        console.error('Failed to create product comment:', error);
        next(error);
    }
}

//로그인한 사용자의 댓글 수정
async function updateComment(req, res, next) {
    try {
        assert(req.body, ProductComment);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid Comment data', errors: error.message });
    }

    const user = req.user;
    const commentId = Number(req.params.commentId);
    try {
        const comment = await prisma.productComment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            return res.status(404).json({ message: 'Product comment not found' });
        }
        if (comment.userId !== user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this comment.' });
        }


        const { content } = req.body;
        const updatedComment = await prisma.productComment.update({
            where: { id: commentId },
            data: { content },
            select: { id: true, content: true, userId: true, productId: true, createdAt: true }
        });
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Failed to update product comment:', error);
        next(error);
    }
}

//로그인한 사용자의 댓글 삭제
async function deleteComment(req, res, next) {
    try {
        const commentId = Number(req.params.commentId)
        const user = req.user;

        const comment = await prisma.productComment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this product comment.' });
        }

        await prisma.productComment.delete({
            where: { id: commentId }
        })
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete product comment:', error);
        next(error);
    }
}

module.exports = router;