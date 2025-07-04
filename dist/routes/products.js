"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const index_1 = __importDefault(require("../lib/passport/index"));
const productController_1 = require("../controllers/productController");
router.post('/create', index_1.default.authenticate('access-token', { session: false }), productController_1.createProduct);
router.patch('/update/:id', index_1.default.authenticate('access-token', { session: false }), productController_1.updateProduct);
router.delete('/:id', index_1.default.authenticate('access-token', { session: false }), productController_1.deleteProduct);
router.get('/my-product', index_1.default.authenticate('access-token', { session: false }), productController_1.getMyProductList);
router.get('/', index_1.default.authenticate('access-token', { session: false }), productController_1.getProductList);
router.get('/me/liked-products', index_1.default.authenticate('access-token', { session: false }), productController_1.getLikedProductList);
exports.default = router;
