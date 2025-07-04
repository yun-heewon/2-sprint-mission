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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_dto_1 = require("../dtos/users.dto");
const superstruct_1 = require("superstruct");
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const index_1 = __importDefault(require("../lib/passport/index"));
const token_1 = require("../lib/token");
const constants_js_1 = require("../lib/constants.js");
const fs_1 = __importDefault(require("fs"));
const upload_js_1 = __importDefault(require("../lib/upload.js"));
const client_1 = require("@prisma/client");
router.get('/me', index_1.default.authenticate('access-token', { session: false }), getUser);
router.post('/register', upload_js_1.default.single('image'), register);
router.post('/login', index_1.default.authenticate('local', { session: false }), login);
router.post('/refresh', index_1.default.authenticate('refresh-token', { session: false }), refreshTokens);
router.patch('/me', index_1.default.authenticate('access-token', { session: false }), patchUser);
router.delete('/:id', index_1.default.authenticate('access-token', { session: false }), deleteUser);
router.post('/logout', logout);
function getUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const users = yield prisma_js_1.default.user.findUnique({
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
            const user = yield prisma_js_1.default.user.create({
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
        setTokenCookies(res, accessToken, refreshToken);
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
            const updatedUser = yield prisma_js_1.default.user.update({
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
            yield prisma_js_1.default.user.delete({
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
    clearTokenCookies(res);
    res.status(200).send();
}
function setTokenCookies(res, accessToken, refreshToken) {
    res.cookie(constants_js_1.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        maxAge: 1 * 60 * 60 * 1000,
    });
    res.cookie(constants_js_1.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        path: '/refresh',
    });
}
function refreshTokens(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = req.user;
        const { accessToken, refreshToken: newRefreshToken } = (0, token_1.generateTokens)(user.id);
        setTokenCookies(res, accessToken, newRefreshToken);
        res.status(200).send();
    });
}
;
function clearTokenCookies(res) {
    res.clearCookie(constants_js_1.ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(constants_js_1.REFRESH_TOKEN_COOKIE_NAME);
}
exports.default = router;
