var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const passport = require('./lib/passport/index.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var articlesRouter = require('./routes/articles');
var articleCommentsRouter = require('./routes/articleComments');
var productCommentsRouter = require('./routes/productComments');
var documentsRouter = require('./routes/documents');
var likeRouter = require('./routes/like');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/articles', articlesRouter);
app.use('/articles/comments', articleCommentsRouter);
app.use('/products/comments', productCommentsRouter);
app.use('/documents', documentsRouter);
app.use('/likes', likeRouter);
app.use('/files', express.static('uploads'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const errorResponse = {
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined,
  };
  res.status(err.status || 500).json(errorResponse);

});

app.listen(3001, () => console.log('Server Started'));

module.exports = app;

