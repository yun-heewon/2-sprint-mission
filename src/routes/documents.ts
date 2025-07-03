import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();
import prisma from '../lib/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import upload from '../lib/upload';
import { Prisma } from '@prisma/client';

router.get('/download/:id', getDocument);
router.post('/upload', upload.single('file'), createDocument);
router.delete('/:id', deleteDocument);



async function getDocument(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const document = await prisma.document.findUnique({
            where: { id },
        });
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const filePath = path.join(__dirname, '../', 'uploads', document.filename);
        if (!fs.existsSync(filePath)) {
            console.error(`File not found on disk: ${filePath}`);
            return res.status(500).json({ error: 'File data mismatch: File not found on server.' });
        }
        res.download(filePath, document.filename, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
            }
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        next(error);
    }
}

async function createDocument(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            return res.status(400).json('No file uploaded.');
        }

        const fileUrl = `/files/${req.file.filename}`;

        const file = await prisma.document.create({
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
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
            console.warn(`Rolled back uploaded file due to error: ${req.file.path}`);
        }
        next(error);
    }
}

async function deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);

        const docToDelete = await prisma.document.findUnique({
            where: { id },
        })

        if (!docToDelete) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // 파일 시스템에서 파일 삭제
        const filePath = path.join(__dirname, '../', 'uploads', docToDelete.filename);
        try {
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
                console.log(`File successfully deleted from filesystem: ${filePath}`);
            } else {
                console.warn(`File not found on disk, skipping filesystem delete: ${filePath}`);
            }
        } catch (fileDeleteError) {
            console.error(`Error deleting file from filesystem (${filePath}):`, fileDeleteError);
            return next(fileDeleteError);
        }
        // 데이터베이스에서 문서 삭제
        await prisma.document.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting document:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Document not found' });
            }
        }
        next(error);
    }
}

export default router;
