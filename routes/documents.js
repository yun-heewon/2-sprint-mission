var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
var multer = require('multer');
var path = require('path')
var fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

router.get('/download/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const document = await prisma.document.findUnique({
            where: { id },
        });
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const filePath = path.join(__dirname, '../', 'uploads', document.filename);
        res.download(filePath, document.filename, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                return next(err);
            }
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        next(error);
    }
});

router.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json('No file uploaded.');
        }

        const file = await prisma.document.create({
            data: {
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: `/files/${req.file.filename}`,
            },
        });
        const path = `/files/${req.file.filename}`;
        res.status(201).json({ path, fileId: file.id });

    }
    catch (error) {
        console.error('Error uploading file:', error);
        next(error);
    };
});

router.delete('/:id', async (req, res, next) => {
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
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return next(err);
            }
        })
        // 데이터베이스에서 문서 삭제
        await prisma.document.delete({
            where: { id },
        }
        );
        res.status(204).json();
    } catch (error) {
        console.error('Error deleting document:', error);

        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Document not found' });
        }
        next(error);
    }
});

module.exports = router;