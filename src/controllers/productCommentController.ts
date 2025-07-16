import { Request, Response, NextFunction } from 'express';
import { ProductComment } from '../dtos/comments.dto';
import { assert } from "superstruct";
import productCommentService from '../services/productCommentService';

//로그인한 사용자의 댓글 생성(product)
export async function createProductComment(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        assert(req.body, ProductComment);

        const user = req.user.id;
        const productId = Number(req.params.productId);
        const { content } = req.body;

        const newProductComment = await productCommentService.createProductComment(user, productId, { content });
        res.status(201).json(newProductComment);
    } catch (error) {
        console.error('Failed to create product comment:', error);
        next(error);
    }
}

//로그인한 사용자의 댓글 수정(product)
export async function updateProductComment(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        assert(req.body, ProductComment);

        const user = req.user.id;
        const commentId = Number(req.params.commentId);
        const { content } = req.body;


        const updatedProductComment = await productCommentService.updateProductComment(user, commentId, { content });
        res.status(200).json(updatedProductComment);
    } catch (error) {
        console.error('Failed to update product comment:', error);
        next(error);
    }
}

//로그인한 사용자의 댓글 삭제(product)
export async function deleteProductComment(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const commentId = Number(req.params.commentId)
        const user = req.user.id;

        await productCommentService.deleteProductComment(user, commentId);
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete product comment:', error);
        next(error);
    }
}