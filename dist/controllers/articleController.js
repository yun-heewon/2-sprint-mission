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
exports.createArticle = createArticle;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
exports.getMyArticleList = getMyArticleList;
exports.getArticleList = getArticleList;
const superstruct_1 = require("superstruct");
const articles_dto_1 = require("../dtos/articles.dto");
const prisma_1 = __importDefault(require("../lib/prisma"));
function createArticle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            (0, superstruct_1.assert)(req.body, articles_dto_1.CreateArticle);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(400).json({ message: 'Invalid Acticle data', errors: error.message });
            }
        }
        const { title, content } = req.body;
        const user = req.user;
        try {
            const post = yield prisma_1.default.article.create({
                data: { title, content, userId: user.id },
                select: { title: true, content: true, createdAt: true }
            });
            res.status(201).json(post);
        }
        catch (error) {
            console.error('Failed to create article:', error);
            next(error);
        }
    });
}
function updateArticle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            (0, superstruct_1.assert)(req.body, articles_dto_1.PatchArticle);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(400).json({ message: 'Invalid Acticle data', errors: error.message });
            }
        }
        const { id } = req.params;
        const user = req.user;
        try {
            const article = yield prisma_1.default.article.findUnique({
                where: { id: Number(id) }
            });
            if (!article) {
                return res.status(404).json({ message: 'Article not found' });
            }
            if (article.userId !== user.id) {
                return res.status(403).json({ message: 'You are not authorized to update this article.' });
            }
            const updatedArticle = yield prisma_1.default.article.update({
                where: { id: Number(id) },
                data: req.body,
                select: { title: true, content: true, updatedAt: true }
            });
            res.status(200).json(updatedArticle);
        }
        catch (error) {
            console.error('Failed to update article:', error);
            next(error);
        }
    });
}
function deleteArticle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const { id } = req.params;
            const user = req.user;
            const article = yield prisma_1.default.article.findUnique({ where: { id: Number(id) } });
            if (!article) {
                return res.status(404).json({ message: 'Article not found' });
            }
            if (article.userId !== user.id) {
                return res.status(403).json({ message: 'You are not authorized to delete this article.' });
            }
            yield prisma_1.default.article.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        }
        catch (error) {
            console.error('Failed to delete article:', error);
            next(error);
        }
    });
}
function getMyArticleList(req, res, next) {
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
            const articles = yield prisma_1.default.article.findMany({
                where: { userId: user.id },
                select: { id: true, title: true, content: true, createdAt: true },
                orderBy,
                skip: parseInt(offset),
                take: parseInt(limit),
            });
            res.status(200).json(articles);
        }
        catch (error) {
            console.error(`Error fetching user's articles:`, error);
            next(error);
        }
    });
}
;
function getArticleList(req, res, next) {
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
            const articlesList = yield prisma_1.default.article.findMany({
                orderBy,
                skip: parseInt(offset),
                take: parseInt(limit),
                select: { id: true, title: true, content: true, createdAt: true },
            });
            const userLikes = yield prisma_1.default.articleLike.findMany({
                where: { userId: userId },
                select: { articleId: true },
            });
            const likedArticleIds = new Set(userLikes.map(like => like.articleId));
            const articleLiked = articlesList.map(article => (Object.assign(Object.assign({}, article), { isLiked: likedArticleIds.has(article.id) })));
            return res.status(200).json(articleLiked);
        }
        catch (error) {
            console.error('Error fetching article list with like status:', error);
            next(error);
        }
    });
}
