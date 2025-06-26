var express = require('express');
var router = express.Router();
const { assert } = require("superstruct");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { CreateProduct, PatchProduct } = require('../dtos/products.dto');

router.post('/create', passport.authenticate('access-token', { session: false }), createProduct);
router.patch('/update/:id', passport.authenticate('access-token', { session: false }), updateProduct);
router.delete('/:id', passport.authenticate('access-token', { session: false }), deleteProduct);

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

/*name, description 필터링 기능을 포함한 제품 목록 조회 API,
offset 방식의 페이지네이션, 
최신순으로 정렬 기능*/
router.get('/list', async (req, res, next) => {
    let orderBy;
    const { offset = 0, limit = 10, order = 'newest', name, description } = req.query;
    switch (order) {
        case 'oldest':
            orderBy = { createdAt: 'asc' };
            break;
        case 'newest':
        default:
            orderBy = { createdAt: 'desc' };
    };

    // name, description 필터링을 위한 조건 생성
    const searchParams = [];

    if (name) {
        searchParams.push({ name: { contains: name, mode: 'insensitive' } });
    }

    if (description) {
        searchParams.push({ description: { contains: description, mode: 'insensitive' } });
    }
    const where = searchParams.length > 0 ? { OR: searchParams } : {};

    try {
        const products = await prisma.product.findMany({
            where,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            select: { id: true, name: true, price: true, createdAt: true }
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
});

// 제품 ID를 파라미터로 받아 해당 제품의 상세 정보를 조회하는 API
router.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await prisma.product.findUnique({
            where: { id },
            select: { id: true, name: true, description: true, price: true, tags: true, createdAt: true }
        });
        if (!product) {
            const error = new Error('Cannot find given product');
            error.statusCode = 404;
            return next(error)
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        next(error);
    }
});

module.exports = router;