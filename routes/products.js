var express = require('express');
var router = express.Router();
const { assert } = require("superstruct");
const app = require("../app");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { CreateProduct, PatchProduct } = require('../dtos/products.dto');



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

    const where = name || description ? {
        OR: [
            { name: { contains: name || '', mode: 'insensitive' } },
            { description: { contains: description || '', mode: 'insensitive' } }
        ]
    } : {};

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


router.post('/create', async (req, res, next) => {
    try {
        assert(req.body, CreateProduct);
        const userId = Number(req.user.id);
        const { name, description, price, tags } = req.body;


        const product = await prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: { name, description, price, tags, userId },
            });
            return product;
        });
        res.status(201).json({ id: product.id });
    } catch (error) {
        console.error('Error creating product:', error);
        next(error);
    }
});

// 상품 수정 API
router.patch('/:id', async (req, res, next) => {
    try {
        assert(req.body, PatchProduct);
        const id = Number(req.params.id);
        const product = await prisma.product.update({
            where: { id },
            data: req.body,
        });
        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        next(error);
    }
});

// 상품 삭제 API
router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await prisma.product.delete({
            where: { id },
        })
        res.status(204).json();
    } catch (error) {
        console.error('Error deleting product:', error);
        next(error);
    }
})


module.exports = router;