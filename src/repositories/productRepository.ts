import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

export class ProductRepository {

    async findById(id: number) {
        return prisma.product.findUnique({
            where: { id }
        });
    }

    async findManyProducts(options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
    }) {
        return prisma.product.findMany({
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
        })
    }

    async findManyByUserId(userId: number, options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
    }) {
        return prisma.product.findMany({
            where: { userId },
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
        });
    }


    async create(data: Prisma.ProductCreateInput) {
        return prisma.product.create({
            data,
        });
    }

    async update(id: number, data: Prisma.ProductUpdateInput) {
        return prisma.product.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return prisma.product.delete({
            where: { id },
        });
    }

    async updateLikeIncrease(id: number) {
        return prisma.product.update({
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
        return prisma.product.update({
            where: { id },
            data: {
                likeCount: { decrement: 1 },
            },
            select: { likeCount: true },
        });
    }
}

export default new ProductRepository();