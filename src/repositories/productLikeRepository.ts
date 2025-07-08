import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

export class ProductLikeRepository {

    async findManyByUserId(userId: number) {
        return prisma.productLike.findMany({
            where: {
                userId
            },
            select: { productId: true },
        });
    };

    async findLikedProductsByUserId(userId: number,
        options?: {
            skip?: number;
            take?: number;
            orderBy?: Prisma.ProductLikeOrderByWithRelationInput;
        }
    ) {
        return prisma.productLike.findMany({
            where: {
                userId
            },
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        likeCount: true,
                        createdAt: true
                    }
                }
            }
        });
    };

    async checkingProductLikeStatus(userId: number, productId: number) {
        return prisma.productLike.findFirst({
            where: {
                userId,
                productId
            },
        });
    }

    async deleteProductLike(id: number) {
        return prisma.productLike.delete({
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

}


export default new ProductLikeRepository();