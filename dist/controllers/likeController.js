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
exports.uploadLikeProduct = uploadLikeProduct;
exports.uploadLikeArticle = uploadLikeArticle;
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
function uploadLikeProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const productId = Number(req.params.productId);
            const userId = req.user.id;
            if (isNaN(productId)) {
                return res.status(400).json({ message: 'Invalid Product ID provided.' });
            }
            const existingLike = yield prisma_1.default.productLike.findFirst({
                where: {
                    userId: userId,
                    productId: productId,
                },
            });
            let updatedProduct;
            let message;
            let isLiked;
            if (existingLike) {
                yield prisma_1.default.productLike.delete({
                    where: { id: existingLike.id },
                });
                updatedProduct = yield prisma_1.default.product.update({
                    where: { id: productId },
                    data: {
                        likeCount: { decrement: 1 },
                    },
                    select: { likeCount: true }
                });
                message = 'Product unliked successfully';
                isLiked = false;
                return res.status(200).json({
                    message: message,
                    likeCount: updatedProduct.likeCount,
                    isLiked: isLiked,
                });
            }
            else {
                yield prisma_1.default.productLike.create({
                    data: {
                        userId: userId,
                        productId: productId,
                    },
                });
                updatedProduct = yield prisma_1.default.product.update({
                    where: { id: productId },
                    data: {
                        likeCount: { increment: 1 },
                    },
                    select: {
                        likeCount: true,
                    }
                });
                message = 'Product liked successfully';
                isLiked = true;
                return res.status(201).json({
                    message: message,
                    likeCount: updatedProduct.likeCount,
                    isLiked: isLiked,
                });
            }
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({ message: 'Product not found.' });
            }
            console.error('Error in uploadLikeProduct:', error);
            next(error);
        }
    });
}
;
function uploadLikeArticle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const articleId = Number(req.params.articleId);
            const userId = req.user.id;
            if (isNaN(articleId)) {
                return res.status(400).json({ message: 'Invalid Article ID format.' });
            }
            const existingLike = yield prisma_1.default.articleLike.findFirst({
                where: {
                    userId: userId,
                    articleId: articleId,
                },
            });
            let updatedArticle;
            let message;
            let isLiked;
            if (existingLike) {
                yield prisma_1.default.articleLike.delete({
                    where: { id: existingLike.id },
                });
                updatedArticle = yield prisma_1.default.article.update({
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
            }
            else {
                yield prisma_1.default.articleLike.create({
                    data: {
                        userId: userId,
                        articleId: articleId,
                    },
                });
                updatedArticle = yield prisma_1.default.article.update({
                    where: { id: articleId },
                    data: {
                        likeCount: { increment: 1 },
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
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({ message: 'Article not found.' });
            }
            console.error('Error in uploadLikeArticle:', error);
            next(error);
        }
    });
}
;
