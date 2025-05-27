const { object, string, partial } = require("superstruct");

const CreateArticle = object({
    title: string(),
    content: string(),
});

const PatchArticle = partial(CreateArticle);

module.exports = {
    CreateArticle, PatchArticle
};