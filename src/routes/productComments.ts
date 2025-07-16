import express from 'express';
const router = express.Router();
import passport from '../lib/passport/index';
import { createProductComment, updateProductComment, deleteProductComment } from '../controllers/productCommentController';

router.post('/:productId/create', passport.authenticate('access-token', { session: false }), createProductComment);
router.patch('/:commentId/update', passport.authenticate('access-token', { session: false }), updateProductComment);
router.delete('/:commentId', passport.authenticate('access-token', { session: false }), deleteProductComment);

export default router;