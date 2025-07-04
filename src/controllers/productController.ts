import { NextFunction, Request, Response } from 'express';
import { assert } from "superstruct";
import { CreateProduct, PatchProduct } from '../dtos/products.dto';
import prisma from '../lib/prisma';
import { Prisma } from "@prisma/client";

//로그인한 사용자의 상품 등록
export async function createProduct(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        assert(req.body, CreateProduct);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return res.status(400).json({ message: 'Invalid Product data', errors: error.message });
        }
    }

    const { name, description, price, tags } = req.body;
    const user = req.user;

    try {
        const product = await prisma.product.create({
            data: { name, description, price, tags, userId: user.id },
            select: { name: true, description: true, price: true, tags: true, createdAt: true }
        });
        res.status(201).json(product);
    } catch (error) {
        console.error('Failed to create product:', error);
        next(error);
    }
}

//로그인한 사용자의 상품 수정
export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        assert(req.body, PatchProduct);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return res.status(400).json({ message: 'Invalid Product data', errors: error.message });
        }
    }

    const { id } = req.params;
    const user = req.user;

    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.userId !== user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this product.' });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: req.body,
            select: { name: true, description: true, price: true, tags: true, updatedAt: true }
        })
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Failed to update product:', error);
        next(error);
    }
}

//로그인한 사용자의 상품 삭제
export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { id } = req.params;
        const user = req.user;

        const product = await prisma.product.findUnique({ where: { id: Number(id) } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.userId !== user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this product.' });
        }

        await prisma.product.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete product:', error);
        next(error);
    }
}

//로그인한 사용자가 작성한 상품 목록
export async function getMyProductList(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user;
    try {
        const { offset = 0, limit = 10, order = 'newest' } = req.query;
        let orderBy: Prisma.ProductOrderByWithRelationInput;
        switch (order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
        };

        const products = await prisma.product.findMany({
            where: { userId: user.id },
            select: { id: true, name: true, price: true, createdAt: true },
            orderBy,
            skip: parseInt(offset as string),
            take: parseInt(limit as string),
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(`Error fetching user's products:`, error);
        next(error);
    }
};

// 상품 목록 조회(isLike 추가)
export async function getProductList(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const userId = req.user.id
        let orderBy: Prisma.ProductOrderByWithRelationInput;
        const { offset = 0, limit = 10, order = 'newest' } = req.query;
        switch (order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
        };

        const productsList = await prisma.product.findMany({
            orderBy,
            skip: parseInt(offset as string),
            take: parseInt(limit as string),
            select: { id: true, name: true, price: true, createdAt: true },
        })

        const userLikes = await prisma.productLike.findMany({
            where: { userId: userId },
            select: { productId: true },
        })
        const likedProductIds = new Set(userLikes.map(like => like.productId));

        const productLiked = productsList.map(product => ({
            ...product,
            isLiked: likedProductIds.has(product.id),
        }));
        return res.status(200).json(productLiked);
    } catch (error) {
        console.error('Error fetching product list with like status:', error);
        next(error);
    }
}


//사용자가 좋아요한 상품 목록
export async function getLikedProductList(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const userId = req.user.id;
        let orderBy: Prisma.ProductLikeOrderByWithRelationInput;
        const { offset = 0, limit = 10, order = 'newest' } = req.query;
        switch (order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
        };

        const likeProducts = await prisma.productLike.findMany({
            where: { userId: userId },
            orderBy,
            skip: parseInt(offset as string),
            take: parseInt(limit as string),
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        likeCount: true,
                        createdAt: true
                    }
                }
            }
        });

        const products = likeProducts.map(item => ({
            ...item.product,
            isLiked: true,
        }));
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
};