import express from 'express';
import passport from '../lib/passport';
const router = express.Router();
import { uploadLikeProduct, uploadLikeArticle } from '../controllers/likeController';

router.post('/products/:productId', passport.authenticate('access-token', { session: false }), uploadLikeProduct);
router.post('/articles/:articleId', passport.authenticate('access-token', { session: false }), uploadLikeArticle);

export default router;