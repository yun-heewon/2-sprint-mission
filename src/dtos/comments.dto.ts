import { string, object, size } from "superstruct";

export const ArticleComment = object({
    content: size(string(), 1, 100)
});

export const ProductComment = object({
    content: size(string(), 1, 100)
});

export interface CommentDto {
    content: string;
}

export interface ArticleCommentOutput {
    id: number;
    content: string;
    userId: number;
    articleId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductCommentOutput {
    id: number;
    content: string;
    userId: number;
    productId: number;
    createdAt: Date;
    updatedAt: Date;
}