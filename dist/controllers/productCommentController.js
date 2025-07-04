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
exports.createProductComment = createProductComment;
exports.updateProductComment = updateProductComment;
exports.deleteProductComment = deleteProductComment;
const comments_dto_1 = require("../dtos/comments.dto");
const superstruct_1 = require("superstruct");
const prisma_1 = __importDefault(require("../lib/prisma"));
function createProductComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            (0, superstruct_1.assert)(req.body, comments_dto_1.ProductComment);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(400).json({ message: 'Invalid Comment data', errors: error.message });
            }
        }
        const user = req.user;
        const productId = Number(req.params.productId);
        try {
            const product = yield prisma_1.default.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            const { content } = req.body;
            const comment = yield prisma_1.default.productComment.create({
                data: { content, userId: user.id, productId: product.id },
                select: { id: true, content: true, userId: true, productId: true, createdAt: true }
            });
            res.status(201).json(comment);
        }
        catch (error) {
            console.error('Failed to create product comment:', error);
            next(error);
        }
    });
}
function updateProductComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            (0, superstruct_1.assert)(req.body, comments_dto_1.ProductComment);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(400).json({ message: 'Invalid Comment data', errors: error.message });
            }
        }
        const user = req.user;
        const commentId = Number(req.params.commentId);
        try {
            const comment = yield prisma_1.default.productComment.findUnique({
                where: { id: commentId },
            });
            if (!comment) {
                return res.status(404).json({ message: 'Product comment not found' });
            }
            if (comment.userId !== user.id) {
                return res.status(403).json({ message: 'You are not authorized to update this comment.' });
            }
            const { content } = req.body;
            const updatedComment = yield prisma_1.default.productComment.update({
                where: { id: commentId },
                data: { content },
                select: { id: true, content: true, userId: true, productId: true, createdAt: true }
            });
            res.status(200).json(updatedComment);
        }
        catch (error) {
            console.error('Failed to update product comment:', error);
            next(error);
        }
    });
}
function deleteProductComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const commentId = Number(req.params.commentId);
            const user = req.user;
            const comment = yield prisma_1.default.productComment.findUnique({ where: { id: commentId } });
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            if (comment.userId !== user.id) {
                return res.status(403).json({ message: 'You are not authorized to delete this product comment.' });
            }
            yield prisma_1.default.productComment.delete({
                where: { id: commentId }
            });
            res.status(204).send();
        }
        catch (error) {
            console.error('Failed to delete product comment:', error);
            next(error);
        }
    });
}
