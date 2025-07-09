import prisma from "../lib/prisma";
import { LikedProductFindManyOptions } from "../types/product";

export class ProductLikeRepository {

    async findManyByUserId(userId: number) {
        return prisma.productLike.findMany({
            where: {
                userId
            },
            select: { productId: true },
        });
    };

    async findLikedProductsByUserId(userId: number, options?: LikedProductFindManyOptions) {
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
                        description: true,
                        price: true,
                        tags: true,
                        userId: true,
                        likeCount: true,
                        createdAt: true,
                        updatedAt: true,
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