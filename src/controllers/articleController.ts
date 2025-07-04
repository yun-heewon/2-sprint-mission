import { NextFunction, Request, Response } from 'express';
import { assert } from "superstruct";
import { CreateArticle, PatchArticle } from '../dtos/articles.dto';
import prisma from '../lib/prisma';
import { Prisma } from "@prisma/client";

//로그인한 사용자의 게시글 등록

export async function createArticle(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        assert(req.body, CreateArticle);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return res.status(400).json({ message: 'Invalid Acticle data', errors: error.message });
        }
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
export async function updateArticle(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        assert(req.body, PatchArticle);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return res.status(400).json({ message: 'Invalid Acticle data', errors: error.message });
        }
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
export async function deleteArticle(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
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
export async function getMyArticleList(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user;
    try {
        const { offset = 0, limit = 10, order = 'newest' } = req.query;
        let orderBy: Prisma.ArticleOrderByWithRelationInput;
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
            skip: parseInt(offset as string),
            take: parseInt(limit as string),
        });

        res.status(200).json(articles);
    } catch (error) {
        console.error(`Error fetching user's articles:`, error);
        next(error);
    }
};

//게시글 목록조회 (isLiked 추가)
export async function getArticleList(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const userId = req.user.id
        let orderBy: Prisma.ArticleOrderByWithRelationInput;
        const { offset = 0, limit = 10, order = 'newest' } = req.query;
        switch (order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
        };

        const articlesList = await prisma.article.findMany({
            orderBy,
            skip: parseInt(offset as string),
            take: parseInt(limit as string),
            select: { id: true, title: true, content: true, createdAt: true },
        })

        const userLikes = await prisma.articleLike.findMany({
            where: { userId: userId },
            select: { articleId: true },
        })
        const likedArticleIds = new Set(userLikes.map(like => like.articleId));

        const articleLiked = articlesList.map(article => ({
            ...article,
            isLiked: likedArticleIds.has(article.id),
        }));
        return res.status(200).json(articleLiked);
    } catch (error) {
        console.error('Error fetching article list with like status:', error);
        next(error);
    }
}