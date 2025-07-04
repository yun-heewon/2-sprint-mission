"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../lib/passport/index"));
const router = express_1.default.Router();
const articleController_1 = require("../controllers/articleController");
router.post('/create', index_1.default.authenticate('access-token', { session: false }), articleController_1.createArticle);
router.patch('/update/:id', index_1.default.authenticate('access-token', { session: false }), articleController_1.updateArticle);
router.delete('/:id', index_1.default.authenticate('access-token', { session: false }), articleController_1.deleteArticle);
router.get('/my-article', index_1.default.authenticate('access-token', { session: false }), articleController_1.getMyArticleList);
router.get('/', index_1.default.authenticate('access-token', { session: false }), articleController_1.getArticleList);
exports.default = router;
