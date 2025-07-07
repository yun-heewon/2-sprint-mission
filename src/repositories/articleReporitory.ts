import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

export class ArticleRepository {

    async findById(id: number) {
        return prisma.article.findUnique({
            where: { id }
        });
    }

    async findManyArticles(options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.ArticleOrderByWithRelationInput;
    }) {
        return prisma.article.findMany({
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
        })
    }

    async findManyByUserId(userId: number, options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.ArticleOrderByWithRelationInput;
    }) {
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
}

export default new ArticleRepository();