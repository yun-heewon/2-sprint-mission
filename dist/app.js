"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./lib/passport/index"));
const index_2 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const articles_1 = __importDefault(require("./routes/articles"));
const articleComments_1 = __importDefault(require("./routes/articleComments"));
const productComments_1 = __importDefault(require("./routes/productComments"));
const documents_1 = __importDefault(require("./routes/documents"));
const like_1 = __importDefault(require("./routes/like"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(index_1.default.initialize());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use('/', index_2.default);
app.use('/users', users_1.default);
app.use('/products', products_1.default);
app.use('/articles', articles_1.default);
app.use('/articles/comments', articleComments_1.default);
app.use('/products/comments', productComments_1.default);
app.use('/documents', documents_1.default);
app.use('/likes', like_1.default);
app.use('/files', express_1.default.static('uploads'));
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
app.use(function (err, req, res, next) {
    const errorResponse = {
        message: err.message,
        stack: req.app.get('env') === 'development' ? err.stack : undefined,
    };
    res.status(err.status || 500).json(errorResponse);
});
app.listen(3001, () => console.log('Server Started'));
module.exports = app;
