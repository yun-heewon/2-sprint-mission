var express = require('express');
var router = express.Router();
const { assert } = require("superstruct");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { CreateProduct, PatchProduct } = require('../dtos/products.dto');

router.post('/create', passport.authenticate('access-token', { session: false }), createProduct);
router.patch('/update/:id', passport.authenticate('access-token', { session: false }), updateProduct);
router.delete('/:id', passport.authenticate('access-token', { session: false }), deleteProduct);
router.get('/my-product', passport.authenticate('access-token', { session: false }), getProductList)

//로그인한 사용자의 상품 등록
async function createProduct(req, res, next) {
    try {
        assert(req.body, CreateProduct);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid Product data', errors: error.message });
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
async function updateProduct(req, res, next) {
    try {
        assert(req.body, PatchProduct);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid Product data', errors: error.message });
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
async function deleteProduct(req, res, next) {
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
async function getProductList(req, res, next) {
    const user = req.user;
    try {
        const { offset = 0, limit = 10, order = 'newest' } = req.query;
        let orderBy;
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
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(`Error fetching user's products:`, error);
        next(error);
    }
};

module.exports = router;