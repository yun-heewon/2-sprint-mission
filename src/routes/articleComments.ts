import express from 'express';
const router = express.Router();
import passport from '../lib/passport/index';
import { createArticleComment, updateArticleComment, deleteArticleComment } from '../controllers/articleCommentController';
import { validateDto } from '../lib/validator';
import { CommentDto } from '../dtos/comments.dto';

router.post('/:articleId/create', passport.authenticate('access-token', { session: false }), validateDto(CommentDto), createArticleComment);
router.patch('/:commentId/update', passport.authenticate('access-token', { session: false }), validateDto(CommentDto), updateArticleComment);
router.delete('/:commentId', passport.authenticate('access-token', { session: false }), deleteArticleComment);

export default router;