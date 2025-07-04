import { Request, Response, NextFunction } from 'express';
import { ProductComment } from '../dtos/comments.dto';
import { assert } from "superstruct";
import prisma from '../lib/prisma';

//로그인한 사용자의 댓글 생성(product)
export async function createProductComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        assert(req.body, ProductComment);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return res.status(400).json({ message: 'Invalid Comment data', errors: error.message });
        }
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

//로그인한 사용자의 댓글 수정(product)
export async function updateProductComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        assert(req.body, ProductComment);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return res.status(400).json({ message: 'Invalid Comment data', errors: error.message });
        }
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

//로그인한 사용자의 댓글 삭제(product)
export async function deleteProductComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
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