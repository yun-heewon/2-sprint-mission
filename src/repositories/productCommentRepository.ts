import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

export class ProductCommentRepository {

    async findById(id: number) {
        return prisma.productComment.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.ProductCommentCreateInput) {
        return prisma.productComment.create({ data });
    }

    async update(id: number, data: Prisma.ProductCommentUpdateInput) {
        return prisma.productComment.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return prisma.productComment.delete({
            where: { id },
        });
    }
}
export default new ProductCommentRepository();