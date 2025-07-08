import prisma from "../lib/prisma";

export class ArticleLikeRepository {

    async findManyByUserId(userId: number) {
        return prisma.articleLike.findMany({
            where: {
                userId
            },
            select: { articleId: true },
        });
    };

    async checkingArticleLikeStatus(userId: number, articleId: number) {
        return prisma.articleLike.findFirst({
            where: {
                userId,
                articleId
            },
        });
    }

    async deleteArticleLike(id: number) {
        return prisma.articleLike.delete({
            where: { id },
        });
    }

    async uploadArticleLike(userId: number, articleId: number) {
        return prisma.articleLike.create({
            data: {
                userId,
                articleId
            },
        });
    }

}

export default new ArticleLikeRepository();