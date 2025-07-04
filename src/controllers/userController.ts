import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { CreateUser, PatchUser } from '../dtos/users.dto';
import { assert } from 'superstruct';
import prisma from '../lib/prisma.js';
import { generateTokens } from '../lib/token';
import fs from 'fs';
import { Prisma } from '@prisma/client';
import { setTokenCookies, clearTokenCookies } from '../lib/token.js';


//정보 조회 
export async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const users = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, nickname: true, createdAt: true }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching user:', error);
        next(error);
    }
}

//회원가입 
export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        assert(req.body, CreateUser);
    } catch (error) {
        console.error('Validation Error:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
            console.warn(`Rolled back uploaded file due to validation error: ${req.file.path}`);
        }
        if (error instanceof Error) {
            return res.status(400).json({ message: 'Invalid registration data', errors: error.message });
        }
    }

    const { email, nickname, password } = req.body;
    let imageFilename = null;

    if (req.file) {
        imageFilename = req.file.filename;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await prisma.user.create({
            data: { email, nickname, password: hashedPassword, image: imageFilename },
            select: { id: true, email: true, nickname: true, image: true, createdAt: true }
        });
        const profileImageUrl = imageFilename ? `/uploads/${imageFilename}` : null;
        res.status(201).json({
            message: 'User registered successfully',
            user: user,
            profileImageUrl: profileImageUrl
        });
    } catch (error) {
        console.error('Failed to register user', error);


        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ message: 'Email or User nickname already exist! Please Change to something else ' });
        }

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
            console.warn(`Rolled back uploaded file due to unexpected error: ${req.file.path}`);
        }

        next(error);
    }
}

//로그인
export async function login(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { accessToken, refreshToken } = generateTokens(req.user.id)
    setTokenCookies(res, accessToken, refreshToken);
    res.status(200).json();

}

//회원정보 수정 
export async function patchUser(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const loggedInUser = req.user.id
    try {
        assert(req.body, PatchUser);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: 'Invalid update data', errors: error.message });
        }
    }

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: loggedInUser },
            data: req.body,
            select: { id: true, email: true, nickname: true, image: true }
        });
        res.status(200).json({ message: 'User updated successfully!', user: updatedUser })
    } catch (error) {
        console.error('Failed to update user', error);

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ message: 'Email or User nickname already exist! Please Change to something else ' });
        }
        res.status(500).json({ message: 'Failed to update user information.' });
    }
}

//user 삭제 
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const id = Number(req.params.id);
        const user = req.user;

        if (id !== user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this account.' });
        }

        await prisma.user.delete({
            where: { id },
        })
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        next(error);
    }
}

export function logout(req: Request, res: Response) {
    clearTokenCookies(res);
    res.status(200).send();
}

