"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchProduct = exports.CreateProduct = void 0;
const superstruct_1 = require("superstruct");
exports.CreateProduct = (0, superstruct_1.object)({
    name: (0, superstruct_1.string)(),
    description: (0, superstruct_1.string)(),
    price: (0, superstruct_1.number)(),
    tags: (0, superstruct_1.array)((0, superstruct_1.string)()),
});
exports.PatchProduct = (0, superstruct_1.partial)(exports.CreateProduct);
