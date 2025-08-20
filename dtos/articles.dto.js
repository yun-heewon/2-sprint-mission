const { object, string, partial, number } = require("superstruct");

const CreateArticle = object({
    title: string(),
    content: string(),
    userId: number()
});

const PatchArticle = partial(CreateArticle);

module.exports = {
    CreateArticle, PatchArticle
};