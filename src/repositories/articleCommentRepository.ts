import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

export class ArticleCommentRepository {

    async findById(id: number) {
        return prisma.articleComment.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.ArticleCommentCreateInput) {
        return prisma.articleComment.create({ data });
    }

    async update(id: number, data: Prisma.ArticleCommentUpdateInput) {
        return prisma.articleComment.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return prisma.articleComment.delete({
            where: { id },
        });
    }
}
export default new ArticleCommentRepository();