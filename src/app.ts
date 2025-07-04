import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { NextFunction, Request, Response } from 'express';
import passport from './lib/passport/index';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import articlesRouter from './routes/articles';
import articleCommentsRouter from './routes/articleComments';
import productCommentsRouter from './routes/productComments';
import documentsRouter from './routes/documents';
import likeRouter from './routes/like';

const app = express();

app.use(cors(
  {
    origin: 'http://localhost:3001',
    credentials: true,
  }
));
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
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  const errorResponse = {
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined,
  };
  res.status(err.status || 500).json(errorResponse);

});

app.listen(3000, () => console.log('Server Started'));

module.exports = app;

