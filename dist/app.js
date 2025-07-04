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
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(index_1.default.initialize());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use('/', index_2.default);
app.use('/files', express_1.default.static('uploads'));
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404, 'Not Found'));
});
app.use(function (err, req, res, next) {
    const isDevelopment = req.app.get('env') === 'development';
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(err);
    const errorResponse = {
        message: message,
    };
    if (isDevelopment && err.stack) {
        errorResponse.stack = err.stack;
    }
    res.status(statusCode).json(errorResponse);
});
app.listen(3000, () => console.log('Server Started'));
exports.default = app;
