const { string, object, size } = require("superstruct");

const ArticleComment = object({
    content: size(string(), 1, 100)
});

const ProductComment = object({
    content: size(string(), 1, 100)
});

module.exports = {
    ArticleComment,
    ProductComment,
};

