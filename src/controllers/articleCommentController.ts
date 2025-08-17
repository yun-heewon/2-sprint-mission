import { Request, Response, NextFunction } from 'express';
import { CommentDto } from '../dtos/comments.dto';
import articleCommentService from '../services/articleCommentService';
import { plainToInstance } from 'class-transformer';


//로그인한 사용자의 댓글 생성(article)
export async function createArticleComment(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = req.user.id;
        const articleId = Number(req.params.articleId);
        const commentData = plainToInstance(CommentDto, req.body)

        const newArticleComment = await articleCommentService.createArticleComment(user, articleId, commentData);

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

        const user = req.user.id;
        const commentId = Number(req.params.commentId);
        const commentData = plainToInstance(CommentDto, req.body)

        const updatedComment = await articleCommentService.updateArticleComment(user, commentId, commentData);
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