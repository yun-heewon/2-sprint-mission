import prisma from "../lib/prisma";

export class LikeRepository {

    async checkingProductLikeStatus(userId: number, productId: number) {
        return prisma.productLike.findFirst({
            where: {
                userId,
                productId
            },
        });
    }

    async checkingArticleLikeStatus(userId: number, articleId: number) {
        return prisma.articleLike.findFirst({
            where: {
                userId,
                articleId
            },
        });
    }

    async deleteProductLike(id: number) {
        return prisma.productLike.delete({
            where: { id },
        });
    }

    async deleteArticleLike(id: number) {
        return prisma.articleLike.delete({
            where: { id },
        });
    }

    async uploadProductLike(userId: number, productId: number) {
        return prisma.productLike.create({
            data: {
                userId,
                productId
            },
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

export default new LikeRepository();