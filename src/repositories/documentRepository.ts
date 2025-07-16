import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

export class DocumentRepository {
    async findById(id: number) {
        return prisma.document.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.DocumentCreateInput) {
        return prisma.document.create({
            data,
        })
    }

    async delete(id: number) {
        return prisma.document.delete({
            where: { id },
        });
    }
}

export default new DocumentRepository();
