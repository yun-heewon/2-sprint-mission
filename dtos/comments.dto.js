const { string, object, partial } = require("superstruct");

const CreateArticleComment = object({
    content: string(),
});

const CreateProductComment = object({
    content: string(),
});

const PatchArticleComment = partial(CreateArticleComment);
const PatchProductComment = partial(CreateProductComment);

module.exports = {
    CreateArticleComment,
    CreateProductComment,
    PatchArticleComment,
    PatchProductComment
};

