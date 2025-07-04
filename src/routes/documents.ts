import express from 'express';
const router = express.Router();
import upload from '../lib/upload';
import { getDocument, createDocument, deleteDocument } from '../controllers/documentController';

router.get('/download/:id', getDocument);
router.post('/upload', upload.single('file'), createDocument);
router.delete('/:id', deleteDocument);

export default router;
