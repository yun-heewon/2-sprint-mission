var express = require('express');
const app = require("../app");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
var router = express.Router();
var multer = require('multer');
var path = require('path')




const upload = multer({ dest: 'uploadDir' });

router.post('/upload', upload.single(file), async (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = await prisma.document.create({
        data: {
            filename: req.file.filename,
            mimtype: req.file.mimetype,
            size: req.file.size,
            url: `documents/files/${req.file.filename}`,
        },
    });
});