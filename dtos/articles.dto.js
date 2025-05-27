const { object, string } = require("superstruct");

const CreateArticle = object({
    title: string(),
    content: string(),
});

module.exports = {
    CreateArticle,
};