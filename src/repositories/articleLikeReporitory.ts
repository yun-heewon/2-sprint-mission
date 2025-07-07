import { Prisma } from "@prisma/client";
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
}

export default new ArticleLikeRepository();