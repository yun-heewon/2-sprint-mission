import { NextFunction, Request, Response } from 'express';
import prisma from '../lib/prisma';
import path from 'path';
import fs from 'fs';
import { Prisma } from '@prisma/client';
import documentService from '../services/documentService';

export async function getDocument(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);

        const document = await documentService.getDocument(id);

        res.download(document.filePath, document.filename, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
            }
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        next(error);
    }
}

export async function createDocument(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            return res.status(400).json('No file uploaded.');
        }

        const fileUrl = `/files/${req.file.filename}`;

        const documentData = {
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: fileUrl
        }

        const file = await documentService.createDocument(documentData);
        res.status(201).json({ url: file.url, fileId: file.id });
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

export async function deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);

        const deleteDocument = await documentService.deleteDocument(id);
        res.status(200).json(deleteDocument);
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