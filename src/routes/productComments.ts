import express from 'express';
const router = express.Router();
import passport from '../lib/passport/index';
import { createProductComment, updateProductComment, deleteProductComment } from '../controllers/productCommentController';
import { CommentDto } from '../dtos/comments.dto';
import { validateDto } from '../lib/validator';

router.post('/:productId/create', passport.authenticate('access-token', { session: false }), validateDto(CommentDto), createProductComment);
router.patch('/:commentId/update', passport.authenticate('access-token', { session: false }), validateDto(CommentDto), updateProductComment);
router.delete('/:commentId', passport.authenticate('access-token', { session: false }), deleteProductComment);

export default router;