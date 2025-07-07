import { Request, Response, NextFunction } from 'express';
import { ArticleComment } from '../dtos/comments.dto';
import { assert } from "superstruct";
import articleCommentService from '../services/articleCommentService';


//로그인한 사용자의 댓글 생성(article)
export async function createArticleComment(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        assert(req.body, ArticleComment);

        const user = req.user.id;
        const articleId = Number(req.params.articleId);
        const { content } = req.body;

        const newArticleComment = await articleCommentService.createArticleComment(user, articleId, { content });

        res.status(201).json(newArticleComment);
    } catch (error) {
        console.error('Failed to create article comment:', error);
        next(error);
    }
}

//로그인한 사용자의 댓글 수정(article)
export async function updateArticleComment(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        assert(req.body, ArticleComment);

        const user = req.user.id;
        const commentId = Number(req.params.commentId);
        const { content } = req.body;

        const updatedComment = await articleCommentService.updateArticleComment(user, commentId, { content });
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Failed to update article comment:', error);
        next(error);
    }
}

//로그인한 사용자의 댓글 삭제(article)
export async function deleteArticleComment(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const commentId = Number(req.params.commentId)
        const user = req.user.id;

        await articleCommentService.deleteArticleComment(user, commentId)
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete article comment:', error);
        next(error);
    }
}