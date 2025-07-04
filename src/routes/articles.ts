import express from 'express';
import passport from '../lib/passport/index';
const router = express.Router();
import { createArticle, updateArticle, deleteArticle, getMyArticleList, getArticleList } from '../controllers/articleController';


router.post('/create', passport.authenticate('access-token', { session: false }), createArticle);
router.patch('/update/:id', passport.authenticate('access-token', { session: false }), updateArticle);
router.delete('/:id', passport.authenticate('access-token', { session: false }), deleteArticle);
router.get('/my-article', passport.authenticate('access-token', { session: false }), getMyArticleList)
router.get('/', passport.authenticate('access-token', { session: false }), getArticleList)

export default router;