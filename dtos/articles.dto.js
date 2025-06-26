const { object, string, partial, number } = require("superstruct");

const CreateArticle = object({
    title: size(string(), 1, 30),
    content: size(string(), 1)
});

const PatchArticle = partial(CreateArticle);

module.exports = {
    CreateArticle, PatchArticle
};