"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const index_1 = __importDefault(require("../lib/passport/index"));
const upload_1 = __importDefault(require("../lib/upload"));
const userController_1 = require("../controllers/userController");
const token_js_1 = require("../lib/token.js");
router.get('/me', index_1.default.authenticate('access-token', { session: false }), userController_1.getUser);
router.post('/register', upload_1.default.single('image'), userController_1.register);
router.post('/login', index_1.default.authenticate('local', { session: false }), userController_1.login);
router.post('/refresh', index_1.default.authenticate('refresh-token', { session: false }), token_js_1.refreshTokens);
router.patch('/me', index_1.default.authenticate('access-token', { session: false }), userController_1.patchUser);
router.delete('/:id', index_1.default.authenticate('access-token', { session: false }), userController_1.deleteUser);
router.post('/logout', userController_1.logout);
exports.default = router;
