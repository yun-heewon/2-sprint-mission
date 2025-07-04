"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchArticle = exports.CreateArticle = void 0;
const superstruct_1 = require("superstruct");
exports.CreateArticle = (0, superstruct_1.object)({
    title: (0, superstruct_1.size)((0, superstruct_1.string)(), 1, 30),
    content: (0, superstruct_1.string)()
});
exports.PatchArticle = (0, superstruct_1.partial)(exports.CreateArticle);
