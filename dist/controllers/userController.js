"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = getUser;
exports.register = register;
exports.login = login;
exports.patchUser = patchUser;
exports.deleteUser = deleteUser;
exports.logout = logout;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_dto_1 = require("../dtos/users.dto");
const superstruct_1 = require("superstruct");
const prisma_1 = __importDefault(require("../lib/prisma"));
const token_1 = require("../lib/token");
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
function getUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const users = yield prisma_1.default.user.findUnique({
                where: { id: req.user.id },
                select: { id: true, email: true, nickname: true, createdAt: true }
            });
            res.status(200).json(users);
        }
        catch (error) {
            console.error('Error fetching user:', error);
            next(error);
        }
    });
}
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, superstruct_1.assert)(req.body, users_dto_1.CreateUser);
        }
        catch (error) {
            console.error('Validation Error:', error);
            if (req.file && fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path);
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
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            const user = yield prisma_1.default.user.create({
                data: { email, nickname, password: hashedPassword, image: imageFilename },
                select: { id: true, email: true, nickname: true, image: true, createdAt: true }
            });
            const profileImageUrl = imageFilename ? `/uploads/${imageFilename}` : null;
            res.status(201).json({
                message: 'User registered successfully',
                user: user,
                profileImageUrl: profileImageUrl
            });
        }
        catch (error) {
            console.error('Failed to register user', error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                return res.status(409).json({ message: 'Email or User nickname already exist! Please Change to something else ' });
            }
            if (req.file && fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path);
                console.warn(`Rolled back uploaded file due to unexpected error: ${req.file.path}`);
            }
            next(error);
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { accessToken, refreshToken } = (0, token_1.generateTokens)(req.user.id);
        (0, token_1.setTokenCookies)(res, accessToken, refreshToken);
        res.status(200).json();
    });
}
function patchUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const loggedInUser = req.user.id;
        try {
            (0, superstruct_1.assert)(req.body, users_dto_1.PatchUser);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: 'Invalid update data', errors: error.message });
            }
        }
        if (req.body.password) {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
            req.body.password = hashedPassword;
        }
        try {
            const updatedUser = yield prisma_1.default.user.update({
                where: { id: loggedInUser },
                data: req.body,
                select: { id: true, email: true, nickname: true, image: true }
            });
            res.status(200).json({ message: 'User updated successfully!', user: updatedUser });
        }
        catch (error) {
            console.error('Failed to update user', error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                return res.status(409).json({ message: 'Email or User nickname already exist! Please Change to something else ' });
            }
            res.status(500).json({ message: 'Failed to update user information.' });
        }
    });
}
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const id = Number(req.params.id);
            const user = req.user;
            if (id !== user.id) {
                return res.status(403).json({ message: 'You are not authorized to delete this account.' });
            }
            yield prisma_1.default.user.delete({
                where: { id },
            });
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting user:', error);
            next(error);
        }
    });
}
function logout(req, res) {
    (0, token_1.clearTokenCookies)(res);
    res.status(200).send();
}
