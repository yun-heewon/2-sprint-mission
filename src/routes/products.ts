import express from 'express';
const router = express.Router();
import passport from '../lib/passport/index';
import { createProduct, updateProduct, deleteProduct, getMyProductList, getProductList, getLikedProductList } from '../controllers/productController';
import { CreateProductDto, PatchProductDto } from '../dtos/products.dto';
import { validateDto } from '../lib/validator';

router.post('/create', passport.authenticate('access-token', { session: false }), validateDto(CreateProductDto), createProduct);
router.patch('/update/:id', passport.authenticate('access-token', { session: false }), validateDto(PatchProductDto),updateProduct);
router.delete('/:id', passport.authenticate('access-token', { session: false }), deleteProduct);
router.get('/my-product', passport.authenticate('access-token', { session: false }), getMyProductList)
router.get('/', passport.authenticate('access-token', { session: false }), getProductList)
router.get('/me/liked-products', passport.authenticate('access-token', { session: false }), getLikedProductList)

export default router;