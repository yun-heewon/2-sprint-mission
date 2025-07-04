"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../lib/passport"));
const router = express_1.default.Router();
const likeController_1 = require("../controllers/likeController");
router.post('/products/:productId', passport_1.default.authenticate('access-token', { session: false }), likeController_1.uploadLikeProduct);
router.post('/articles/:articleId', passport_1.default.authenticate('access-token', { session: false }), likeController_1.uploadLikeArticle);
exports.default = router;
