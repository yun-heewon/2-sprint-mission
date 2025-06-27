const { object, string, partial, size } = require("superstruct");

const CreateArticle = object({
    title: size(string(), 1, 30),
    content: string()
});

const PatchArticle = partial(CreateArticle);

module.exports = {
    CreateArticle, PatchArticle
};