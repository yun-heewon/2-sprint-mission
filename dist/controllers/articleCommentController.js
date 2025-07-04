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
exports.createArticleComment = createArticleComment;
exports.updateArticleComment = updateArticleComment;
exports.deleteArticleComment = deleteArticleComment;
const comments_dto_1 = require("../dtos/comments.dto");
const superstruct_1 = require("superstruct");
const prisma_1 = __importDefault(require("../lib/prisma"));
function createArticleComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            (0, superstruct_1.assert)(req.body, comments_dto_1.ArticleComment);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(400).json({ message: 'Invalid Comment data', errors: error.message });
            }
        }
        const user = req.user;
        const articleId = Number(req.params.articleId);
        try {
            const article = yield prisma_1.default.article.findUnique({
                where: { id: articleId },
            });
            if (!article) {
                return res.status(404).json({ message: 'Article not found' });
            }
            const { content } = req.body;
            const comment = yield prisma_1.default.articleComment.create({
                data: { content, userId: user.id, articleId: article.id },
                select: { id: true, content: true, userId: true, articleId: true, createdAt: true }
            });
            res.status(201).json(comment);
        }
        catch (error) {
            console.error('Failed to create article comment:', error);
            next(error);
        }
    });
}
function updateArticleComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            (0, superstruct_1.assert)(req.body, comments_dto_1.ArticleComment);
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
            const comment = yield prisma_1.default.articleComment.findUnique({
                where: { id: commentId },
            });
            if (!comment) {
                return res.status(404).json({ message: 'Article comment not found' });
            }
            if (comment.userId !== user.id) {
                return res.status(403).json({ message: 'You are not authorized to update this comment.' });
            }
            const { content } = req.body;
            const updatedComment = yield prisma_1.default.articleComment.update({
                where: { id: commentId },
                data: { content },
                select: { id: true, content: true, userId: true, articleId: true, createdAt: true }
            });
            res.status(201).json(updatedComment);
        }
        catch (error) {
            console.error('Failed to update article comment:', error);
            next(error);
        }
    });
}
function deleteArticleComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const commentId = Number(req.params.commentId);
            const user = req.user;
            const comment = yield prisma_1.default.articleComment.findUnique({ where: { id: commentId } });
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            if (comment.userId !== user.id) {
                return res.status(403).json({ message: 'You are not authorized to delete this article comment.' });
            }
            yield prisma_1.default.articleComment.delete({
                where: { id: commentId }
            });
            res.status(204).send();
        }
        catch (error) {
            console.error('Failed to delete article comment:', error);
            next(error);
        }
    });
}
