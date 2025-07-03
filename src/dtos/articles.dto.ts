import { object, string, partial, size } from "superstruct";

export const CreateArticle = object({
    title: size(string(), 1, 30),
    content: string()
});

export const PatchArticle = partial(CreateArticle);

