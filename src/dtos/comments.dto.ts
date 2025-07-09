import { string, object, size } from "superstruct";

export const ArticleComment = object({
    content: size(string(), 1, 100)
});

export const ProductComment = object({
    content: size(string(), 1, 100)
});