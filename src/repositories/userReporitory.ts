import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

export class UserRepository {

    async findById(id: number) {
        return prisma.user.findUnique({
            where: { id }
        })
    };

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    async findByNickname(nickname: string) {
        return prisma.user.findUnique({
            where: { nickname }
        });
    }

    async create(data: Prisma.UserCreateInput) {
        return prisma.user.create({
            data,
        });
    }

    async update(id: number, data: Prisma.UserUpdateInput) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return prisma.user.delete({
            where: { id },
        });
    }

}

export default new UserRepository();