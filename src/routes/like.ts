import express, { NextFunction, Request, Response } from 'express';
import passport from '../lib/passport';
import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';
const router = express.Router();

router.post('/products/:productId', passport.authenticate('access-token', { session: false }), uploadLikeProduct);
router.post('/articles/:articleId', passport.authenticate('access-token', { session: false }), uploadLikeArticle);

async function uploadLikeProduct(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const productId = Number(req.params.productId)
        const userId = req.user.id;

        if (isNaN(productId)) {
            return res.status(400).json({ message: 'Invalid Product ID provided.' });
        }

        // 해당 사용자가 이미 좋아요를 눌렀는지 확인 
        const existingLike = await prisma.productLike.findFirst({
            where: {
                userId: userId,
                productId: productId,
            },
        });

        let updatedProduct;
        let message;
        let isLiked;


        if (existingLike) {
            //좋아요 눌렀으면, productLike 레코드의 고유 ID로 삭제함
            await prisma.productLike.delete({
                where: { id: existingLike.id },
            });
            //likeCount 감소 업데이트
            updatedProduct = await prisma.product.update({
                where: { id: productId },
                data: {
                    likeCount: { decrement: 1 },
                },
                select: { likeCount: true }
            });
            message = 'Product unliked successfully';
            isLiked = false;
            //좋아요 취소 시 상태코드 반환
            return res.status(200).json({
                message: message,
                likeCount: updatedProduct.likeCount,
                isLiked: isLiked,
            });

        } else {
            //좋아요 없으면, productLike에 레코드 생성
            await prisma.productLike.create({
                data: {
                    userId: userId,
                    productId: productId,
                },
            });
            //likeCount 증가 업데이트
            updatedProduct = await prisma.product.update({
                where: { id: productId },
                data: {
                    likeCount: { increment: 1 }, // 좋아요 카운트 1 증가
                },
                select: {
                    likeCount: true,
                }
            });
            message = 'Product liked successfully';
            isLiked = true;
            //좋아요 추가 시 상태코드 반환
            return res.status(201).json({
                message: message,
                likeCount: updatedProduct.likeCount,
                isLiked: isLiked,
            });
        }
    } catch (error) {
        //상품이 없을 때 오류처리
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: 'Product not found.' });
        }

        console.error('Error in uploadLikeProduct:', error)
        next(error)
    }
};

async function uploadLikeArticle(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const articleId = Number(req.params.articleId)
        const userId = req.user.id;

        if (isNaN(articleId)) {
            return res.status(400).json({ message: 'Invalid Article ID format.' });
        }

        // 해당 사용자가 이미 좋아요를 눌렀는지 확인 
        const existingLike = await prisma.articleLike.findFirst({
            where: {
                userId: userId,
                articleId: articleId,
            },
        });

        let updatedArticle;
        let message;
        let isLiked;


        if (existingLike) {
            await prisma.articleLike.delete({
                where: { id: existingLike.id },
            });

            updatedArticle = await prisma.article.update({
                where: { id: articleId },
                data: {
                    likeCount: { decrement: 1 },
                },
                select: { likeCount: true }
            });
            message = 'Article unliked successfully';
            isLiked = false;

            return res.status(200).json({
                message: message,
                likeCount: updatedArticle.likeCount,
                isLiked: isLiked,
            });

        } else {
            await prisma.articleLike.create({
                data: {
                    userId: userId,
                    articleId: articleId,
                },
            });
            updatedArticle = await prisma.article.update({
                where: { id: articleId },
                data: {
                    likeCount: { increment: 1 }, // 좋아요 카운트 1 증가
                },
                select: {
                    likeCount: true,
                }
            });
            message = 'Article liked successfully';
            isLiked = true;

            return res.status(201).json({
                message: message,
                likeCount: updatedArticle.likeCount,
                isLiked: isLiked,
            });
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: 'Article not found.' });
        }

        console.error('Error in uploadLikeArticle:', error)
        next(error)
    }
};

export default router;