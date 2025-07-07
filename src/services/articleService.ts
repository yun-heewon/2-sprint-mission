import { Prisma } from "@prisma/client";
import ArticleReporitory from "../repositories/articleReporitory";
import { deleteArticle } from "../controllers/articleController";
import articleLikeReporitory, { ArticleLikeRepository } from "../repositories/articleLikeReporitory";


export class ArticleService {
    async createArticle(userId: number, articleData: { title: string, content: string }) {

        const createData: Prisma.ArticleCreateInput = {
            title: articleData.title,
            content: articleData.content,
            user: {
                connect: { id: userId }
            },
        };

        const newArticle = await ArticleReporitory.create(createData);

        return newArticle;
    }

    async updateArticle(articleId: number, userId: number, articleData: Prisma.ArticleUpdateInput) {

        const article = await ArticleReporitory.findById(articleId);
        if (!article) {
            throw new Error('Article not found');
        }

        if (article.userId !== userId) {
            throw new Error('Unauthorized to update this article');
        }

        const articleUpdateData: Prisma.ArticleUpdateInput = {
            title: articleData.title,
            content: articleData.content,
        };

        const updateArticle = await ArticleReporitory.update(articleId, articleUpdateData);
        if (!updateArticle) {
            throw new Error('Article update failed');
        }

        return updateArticle;
    }

    async deleteArticle(userId: number, articleId: number) {
        const article = await ArticleReporitory.findById(articleId);
        if (!article) {
            throw new Error('Article not found');
        }

        if (article.userId !== userId) {
            throw new Error('Unauthorized to delete this article');
        }

        await ArticleReporitory.delete(articleId);

        return { message: 'Article deleted successfully' };
    }

    async myArticles(userId: number,
        options: {
            offset?: number;
            limit?: number;
            order?: 'newest' | 'oldest';
        }
    ) {
        let orderBy: Prisma.ArticleOrderByWithRelationInput;
        switch (options.order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        };

        const myArticles = await ArticleReporitory.findManyByUserId(userId);

        return myArticles
    }

    async getArticleList(userId: number,
        options: {
            offset?: number;
            limit?: number;
            order?: 'newest' | 'oldest';
        }
    ) {
        let orderBy: Prisma.ArticleOrderByWithRelationInput;
        switch (options.order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        };

        // 게시글 목록 가져오기 
        const getArticleList = await ArticleReporitory.findManyArticles({
            skip: options.offset,
            take: options.limit,
            orderBy: orderBy,
        });

        //로그인한 사용자가 좋아요 누른 게시글 목록 가져오기 
        const myLikedArticle = await articleLikeReporitory.findManyByUserId(userId);

        // 좋아요 누른 게시글 ID를 Set으로 변환
        const likedArticleIds = new Set(myLikedArticle.map(like => like.articleId));

        //전체 게시글 목록에 isLiked 추가 
        const articleLiked = getArticleList.map(article => ({
            ...article,
            isLiked: likedArticleIds.has(article.id),
        }));
        return articleLiked;
    }
}


export default new ArticleService();