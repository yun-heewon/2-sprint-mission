"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const index_1 = __importDefault(require("../lib/passport/index"));
const articleCommentController_1 = require("../controllers/articleCommentController");
router.post('/:articleId/create', index_1.default.authenticate('access-token', { session: false }), articleCommentController_1.createArticleComment);
router.patch('/:commentId/update', index_1.default.authenticate('access-token', { session: false }), articleCommentController_1.updateArticleComment);
router.delete('/:commentId', index_1.default.authenticate('access-token', { session: false }), articleCommentController_1.deleteArticleComment);
exports.default = router;
