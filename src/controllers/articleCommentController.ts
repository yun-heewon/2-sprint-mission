import { Request, Response, NextFunction } from 'express';
import { ArticleComment } from '../dtos/comments.dto';
import { assert } from "superstruct";
import prisma from '../lib/prisma';

//로그인한 사용자의 댓글 생성(article)
export async function createArticleComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        assert(req.body, ArticleComment);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return res.status(400).json({ message: 'Invalid Comment data', errors: error.message });
        }
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

//로그인한 사용자의 댓글 수정(article)
export async function updateArticleComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        assert(req.body, ArticleComment);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return res.status(400).json({ message: 'Invalid Comment data', errors: error.message });
        }
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

//로그인한 사용자의 댓글 삭제(article)
export async function deleteArticleComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
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