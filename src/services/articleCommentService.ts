import { Prisma } from "@prisma/client";
import articleCommentRepository from "../repositories/articleCommentRepository";
import articleReporitory from "../repositories/articleReporitory";
import userReporitory from "../repositories/userReporitory";
import { CommentDto } from "../dtos/comments.dto";

interface ArticleCommentOutput {
    id: number;
    content: string;
    userId: number;
    articleId: number;
    createdAt: Date;
    updatedAt: Date;
}

export class ArticleCommentService {
    async createArticleComment(userId: number, articleId: number, commentData: CommentDto): Promise<ArticleCommentOutput> {
        const user = await userReporitory.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const article = await articleReporitory.findById(articleId);
        if (!article) {
            throw new Error('Article not found');
        }

        if (!commentData.content || commentData.content.trim().length === 0) {
            throw new Error('Comment content cannot be empty.');
        }

        const createData: Prisma.ArticleCommentCreateInput = {
            content: commentData.content,
            user: {
                connect: { id: userId }
            },
            article: {
                connect: { id: articleId }
            },
        };

        const newArticleComment = await articleCommentRepository.create(createData);

        return { ...newArticleComment };
    }

    async updateArticleComment(userId: number, articleCommentId: number, updateComment: CommentDto): Promise<ArticleCommentOutput> {

        const user = await userReporitory.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const articleComment = await articleCommentRepository.findById(articleCommentId);
        if (!articleComment) {
            throw new Error('Article comment not found');
        }

        if (articleComment.userId !== userId) {
            throw new Error('Unauthorized to update this article comment');
        }

        const articleCommentUpdateDate: Prisma.ArticleCommentUpdateInput = {
            content: updateComment.content,
        };

        const updateArticleComment = await articleCommentRepository.update(articleCommentId, articleCommentUpdateDate);

        return { ...updateArticleComment };
    }

    async deleteArticleComment(userId: number, articleCommentId: number) {
        const articleComment = await articleCommentRepository.findById(articleCommentId);
        if (!articleComment) {
            throw new Error('Article comment not found');
        }

        if (articleComment.userId !== userId) {
            throw new Error('You are not authorized to delete this article comment.')
        }

        await articleCommentRepository.delete(articleCommentId);

        return { message: 'Article comment deleted successfully' };
    }
}

export default new ArticleCommentService();