"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const index_1 = __importDefault(require("../lib/passport/index"));
const productCommentController_1 = require("../controllers/productCommentController");
router.post('/:productId/create', index_1.default.authenticate('access-token', { session: false }), productCommentController_1.createProductComment);
router.patch('/:commentId/update', index_1.default.authenticate('access-token', { session: false }), productCommentController_1.updateProductComment);
router.delete('/:commentId', index_1.default.authenticate('access-token', { session: false }), productCommentController_1.deleteProductComment);
exports.default = router;
