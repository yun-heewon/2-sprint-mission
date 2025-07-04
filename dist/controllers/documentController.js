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
exports.getDocument = getDocument;
exports.createDocument = createDocument;
exports.deleteDocument = deleteDocument;
const prisma_1 = __importDefault(require("../lib/prisma"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
function getDocument(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const document = yield prisma_1.default.document.findUnique({
                where: { id },
            });
            if (!document) {
                return res.status(404).json({ error: 'Document not found' });
            }
            const filePath = path_1.default.join(__dirname, '../', 'uploads', document.filename);
            if (!fs_1.default.existsSync(filePath)) {
                console.error(`File not found on disk: ${filePath}`);
                return res.status(500).json({ error: 'File data mismatch: File not found on server.' });
            }
            res.download(filePath, document.filename, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                }
            });
        }
        catch (error) {
            console.error('Error fetching documents:', error);
            next(error);
        }
    });
}
function createDocument(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.file) {
                return res.status(400).json('No file uploaded.');
            }
            const fileUrl = `/files/${req.file.filename}`;
            const file = yield prisma_1.default.document.create({
                data: {
                    filename: req.file.filename,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    url: fileUrl,
                },
            });
            res.status(201).json({ url: fileUrl, fileId: file.id });
        }
        catch (error) {
            console.error('Error uploading file or saving document record:', error);
            if (req.file && fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path);
                console.warn(`Rolled back uploaded file due to error: ${req.file.path}`);
            }
            next(error);
        }
    });
}
function deleteDocument(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const docToDelete = yield prisma_1.default.document.findUnique({
                where: { id },
            });
            if (!docToDelete) {
                return res.status(404).json({ error: 'Document not found' });
            }
            const filePath = path_1.default.join(__dirname, '../', 'uploads', docToDelete.filename);
            try {
                if (fs_1.default.existsSync(filePath)) {
                    yield fs_1.default.promises.unlink(filePath);
                    console.log(`File successfully deleted from filesystem: ${filePath}`);
                }
                else {
                    console.warn(`File not found on disk, skipping filesystem delete: ${filePath}`);
                }
            }
            catch (fileDeleteError) {
                console.error(`Error deleting file from filesystem (${filePath}):`, fileDeleteError);
                return next(fileDeleteError);
            }
            yield prisma_1.default.document.delete({
                where: { id },
            });
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting document:', error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return res.status(404).json({ error: 'Document not found' });
                }
            }
            next(error);
        }
    });
}
