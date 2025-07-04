"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const upload_1 = __importDefault(require("../lib/upload"));
const documentController_1 = require("../controllers/documentController");
router.get('/download/:id', documentController_1.getDocument);
router.post('/upload', upload_1.default.single('file'), documentController_1.createDocument);
router.delete('/:id', documentController_1.deleteDocument);
exports.default = router;
