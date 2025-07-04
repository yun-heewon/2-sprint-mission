"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductComment = exports.ArticleComment = void 0;
const superstruct_1 = require("superstruct");
exports.ArticleComment = (0, superstruct_1.object)({
    content: (0, superstruct_1.size)((0, superstruct_1.string)(), 1, 100)
});
exports.ProductComment = (0, superstruct_1.object)({
    content: (0, superstruct_1.size)((0, superstruct_1.string)(), 1, 100)
});
