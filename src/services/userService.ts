import { Prisma } from "@prisma/client";
import UserRepository from "../repositories/userReporitory";
import bcrypt from 'bcrypt';
import { generateTokens } from '../lib/token';

export class UserService {
    async getUserProfile(userId: number) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async registerUser(userData: { email: string; nickname: string; password: string; image: string | null }) {

        //1. 이메일 중복 확인
        const existingEmail = await UserRepository.findByEmail(userData.email);
        if (existingEmail) {
            throw new Error('This Email already exist! Please Change to something else');
        }

        //2. 닉네임 중복 확인
        const existingNickname = await UserRepository.findByNickname(userData.nickname);
        if (existingNickname) {
            throw new Error('This Nickname already exist! Please Change to something else');
        }

        //3. 비밀번호 해싱
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = await UserRepository.create({
            email: userData.email,
            nickname: userData.nickname,
            password: hashedPassword,
            image: userData.image,
        });

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async generateAuthTokens(userId: number) {
        const { accessToken, refreshToken } = generateTokens(userId);
        return { accessToken, refreshToken };
    }

    async updateUser(userId: number, updateData: Prisma.UserUpdateInput) {
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10)
            updateData.password = await bcrypt.hash(updateData.password as string, salt)
        }
        try {
            const updatedUser = await UserRepository.update(userId, updateData);

            if (!updatedUser) {
                throw new Error('User not found or update failed');
            }

            const { password, ...userWithoutPassword } = updatedUser;
            return userWithoutPassword;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new Error('Email or User nickname already exist! Please Change to something else');
            }
        }
    }

    async deleteUser(userId: number) {
        const existingUser = await UserRepository.findById(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }

        await UserRepository.delete(userId);
        return { message: 'User deleted successfully' };
    }
}


export default new UserService();