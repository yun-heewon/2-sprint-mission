const { string, object, partial, number } = require("superstruct");

const CreateArticleComment = object({
    content: string(),
    userId: number(),
    articleId: number()
});

const CreateProductComment = object({
    content: string(),
    userId: number(),
    productId: number()
});

const PatchArticleComment = partial(CreateArticleComment);
const PatchProductComment = partial(CreateProductComment);

module.exports = {
    CreateArticleComment,
    CreateProductComment,
    PatchArticleComment,
    PatchProductComment
};

