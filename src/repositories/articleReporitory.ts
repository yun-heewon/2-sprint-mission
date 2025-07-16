import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { ArticleFindManyOptions } from "../types/article";

export class ArticleRepository {

    async findById(id: number) {
        return prisma.article.findUnique({
            where: { id }
        });
    }

    async findManyArticles(options?: ArticleFindManyOptions) {
        return prisma.article.findMany({
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
        })
    }

    async findManyByUserId(userId: number, options?: ArticleFindManyOptions) {
        return prisma.article.findMany({
            where: { userId },
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
        });
    }


    async create(data: Prisma.ArticleCreateInput) {
        return prisma.article.create({
            data,
        });
    }

    async update(id: number, data: Prisma.ArticleUpdateInput) {
        return prisma.article.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return prisma.article.delete({
            where: { id },
        });
    }

    async updateLikeIncrease(id: number) {
        return prisma.article.update({
            where: { id },
            data: {
                likeCount: { increment: 1 },
            },
            select: {
                likeCount: true,
            },
        });
    }

    async updateLikeDecrease(id: number) {
        return prisma.article.update({
            where: { id },
            data: {
                likeCount: { decrement: 1 },
            },
            select: { likeCount: true },
        });
    }
}

export default new ArticleRepository();