"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchUser = exports.CreateUser = void 0;
const superstruct_1 = require("superstruct");
const is_email_1 = __importDefault(require("is-email"));
const Email = (0, superstruct_1.define)('Email', (value) => {
    return typeof value === 'string' && (0, is_email_1.default)(value);
});
exports.CreateUser = (0, superstruct_1.object)({
    email: Email,
    nickname: (0, superstruct_1.size)((0, superstruct_1.string)(), 1, 15),
    password: (0, superstruct_1.string)(),
    image: (0, superstruct_1.optional)((0, superstruct_1.string)())
});
exports.PatchUser = (0, superstruct_1.partial)(exports.CreateUser);
