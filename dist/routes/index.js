"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./users"));
const products_1 = __importDefault(require("./products"));
const articles_1 = __importDefault(require("./articles"));
const articleComments_1 = __importDefault(require("./articleComments"));
const productComments_1 = __importDefault(require("./productComments"));
const documents_1 = __importDefault(require("./documents"));
const like_1 = __importDefault(require("./like"));
const router = express_1.default.Router();
router.use('/users', users_1.default);
router.use('/products', products_1.default);
router.use('/articles', articles_1.default);
router.use('/articles/comments', articleComments_1.default);
router.use('/products/comments', productComments_1.default);
router.use('/documents', documents_1.default);
router.use('/likes', like_1.default);
router.use('/files', express_1.default.static('uploads'));
router.get('/', (req, res) => {
    res.status(200).json({ message: 'welcome!' });
});
exports.default = router;
