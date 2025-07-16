import express from 'express';
const router = express.Router();
import passport from '../lib/passport/index';
import { createArticleComment, updateArticleComment, deleteArticleComment } from '../controllers/articleCommentController';

router.post('/:articleId/create', passport.authenticate('access-token', { session: false }), createArticleComment);
router.patch('/:commentId/update', passport.authenticate('access-token', { session: false }), updateArticleComment);
router.delete('/:commentId', passport.authenticate('access-token', { session: false }), deleteArticleComment);

export default router;