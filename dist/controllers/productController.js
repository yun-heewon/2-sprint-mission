"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getMyProductList = getMyProductList;
exports.getProductList = getProductList;
exports.getLikedProductList = getLikedProductList;
const superstruct_1 = require("superstruct");
const products_dto_1 = require("../dtos/products.dto");
const prisma_1 = __importDefault(require("../lib/prisma"));
function createProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            (0, superstruct_1.assert)(req.body, products_dto_1.CreateProduct);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(400).json({ message: 'Invalid Product data', errors: error.message });
            }
        }
        const { name, description, price, tags } = req.body;
        const user = req.user;
        try {
            const product = yield prisma_1.default.product.create({
                data: { name, description, price, tags, userId: user.id },
                select: { name: true, description: true, price: true, tags: true, createdAt: true }
            });
            res.status(201).json(product);
        }
        catch (error) {
            console.error('Failed to create product:', error);
            next(error);
        }
    });
}
function updateProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            (0, superstruct_1.assert)(req.body, products_dto_1.PatchProduct);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(400).json({ message: 'Invalid Product data', errors: error.message });
            }
        }
        const { id } = req.params;
        const user = req.user;
        try {
            const product = yield prisma_1.default.product.findUnique({
                where: { id: Number(id) }
            });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (product.userId !== user.id) {
                return res.status(403).json({ message: 'You are not authorized to update this product.' });
            }
            const updatedProduct = yield prisma_1.default.product.update({
                where: { id: Number(id) },
                data: req.body,
                select: { name: true, description: true, price: true, tags: true, updatedAt: true }
            });
            res.status(200).json(updatedProduct);
        }
        catch (error) {
            console.error('Failed to update product:', error);
            next(error);
        }
    });
}
function deleteProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const { id } = req.params;
            const user = req.user;
            const product = yield prisma_1.default.product.findUnique({ where: { id: Number(id) } });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (product.userId !== user.id) {
                return res.status(403).json({ message: 'You are not authorized to delete this product.' });
            }
            yield prisma_1.default.product.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        }
        catch (error) {
            console.error('Failed to delete product:', error);
            next(error);
        }
    });
}
function getMyProductList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
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
            }
            ;
            const products = yield prisma_1.default.product.findMany({
                where: { userId: user.id },
                select: { id: true, name: true, price: true, createdAt: true },
                orderBy,
                skip: parseInt(offset),
                take: parseInt(limit),
            });
            res.status(200).json(products);
        }
        catch (error) {
            console.error(`Error fetching user's products:`, error);
            next(error);
        }
    });
}
;
function getProductList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const userId = req.user.id;
            let orderBy;
            const { offset = 0, limit = 10, order = 'newest' } = req.query;
            switch (order) {
                case 'oldest':
                    orderBy = { createdAt: 'asc' };
                    break;
                case 'newest':
                default:
                    orderBy = { createdAt: 'desc' };
            }
            ;
            const productsList = yield prisma_1.default.product.findMany({
                orderBy,
                skip: parseInt(offset),
                take: parseInt(limit),
                select: { id: true, name: true, price: true, createdAt: true },
            });
            const userLikes = yield prisma_1.default.productLike.findMany({
                where: { userId: userId },
                select: { productId: true },
            });
            const likedProductIds = new Set(userLikes.map(like => like.productId));
            const productLiked = productsList.map(product => (Object.assign(Object.assign({}, product), { isLiked: likedProductIds.has(product.id) })));
            return res.status(200).json(productLiked);
        }
        catch (error) {
            console.error('Error fetching product list with like status:', error);
            next(error);
        }
    });
}
function getLikedProductList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const userId = req.user.id;
            let orderBy;
            const { offset = 0, limit = 10, order = 'newest' } = req.query;
            switch (order) {
                case 'oldest':
                    orderBy = { createdAt: 'asc' };
                    break;
                case 'newest':
                default:
                    orderBy = { createdAt: 'desc' };
            }
            ;
            const likeProducts = yield prisma_1.default.productLike.findMany({
                where: { userId: userId },
                orderBy,
                skip: parseInt(offset),
                take: parseInt(limit),
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
            const products = likeProducts.map(item => (Object.assign(Object.assign({}, item.product), { isLiked: true })));
            res.status(200).json(products);
        }
        catch (error) {
            console.error('Error fetching products:', error);
            next(error);
        }
    });
}
;
