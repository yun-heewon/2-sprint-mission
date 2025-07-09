import { NextFunction, Request, Response } from 'express';
import { CreateUser, PatchUser } from '../dtos/users.dto';
import { assert } from 'superstruct';
import { setTokenCookies, clearTokenCookies } from '../lib/token';
import fs from 'fs';
import userService from '../services/userService';
import { PatchUserDto } from '../types/user';




//정보 조회 
export async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = req.user.id;

        const userProfile = await userService.getUserProfile(userId)
        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching user:', error);
        next(error);
    }
}

//회원가입 
export async function register(req: Request, res: Response, next: NextFunction) {
    let uploadedFilePath: string | null = null;
    try {
        assert(req.body, CreateUser);
        const { email, nickname, password } = req.body;

        if (!email || !nickname || !password) {
            return res.status(400).json({ message: 'Email, nickname and password are required.' });
        }

        let imageFilename: string | null = null;
        if (req.file) {
            imageFilename = req.file.filename;
            uploadedFilePath = req.file.path; // 롤백을 위해 파일 경로 저장
        }

        const newUser = await userService.registerUser({
            email,
            nickname,
            password,
            image: imageFilename,
        })

        const profileImageUrl = imageFilename ? `/uploads/${imageFilename}` : null;
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser, // 비밀번호 없는 사용자 정보
            profileImageUrl: profileImageUrl
        });
    } catch (error: any) {

        console.error('Error during user registration:', error);
        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
            fs.unlinkSync(uploadedFilePath);
            console.warn(`Rolled back uploaded file due to error: ${uploadedFilePath}`);
        }
        if (error.message === 'Email already exist! Please Change to something else' ||
            error.message === 'User nickname already exist! Please Change to something else') {
            return res.status(409).json({ message: error.message });
        }
        if (error instanceof Error && error.message.includes('Validation Error')) {
            return res.status(400).json({ message: 'Invalid registration data', errors: error.message });
        }
        next(error);
    }
}

//로그인
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const userId = req.user.id

        const { accessToken, refreshToken } = await userService.generateAuthTokens(userId);

        setTokenCookies(res, accessToken, refreshToken);
        const { password, ...userWithoutPassword } = req.user

        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Login Error', error);
        next(error);
    }
}

//회원정보 수정 
export async function patchUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const loggedInUser = req.user.id

        assert(req.body, PatchUser);

        const updateData: PatchUserDto = req.body as PatchUserDto;

        const updatedUser = await userService.updateUser(loggedInUser, updateData);

        res.status(200).json({ message: ' User updated successfully!', user: updatedUser })
    } catch (error) {
        console.error('Error updating user:', error);
        if (error instanceof Error) {
            return res.status(400).json({ message: 'Invalid update data', errors: error.message });
        }
        next(error);
    }
}

//user 삭제 
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const id = Number(req.params.id);
        const loggedInUser = req.user.id

        if (id !== loggedInUser) {
            return res.status(403).json({ message: 'You are not authorized to delete this account.' });
        }

        await userService.deleteUser(id);
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

