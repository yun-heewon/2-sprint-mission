import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { NextFunction, Request, Response } from "express";
import passport from "./lib/passport/index";
import { HttpError } from "http-errors";
import { createSocket } from "./lib/socket";
import createRouter from "./routes/index";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/files", express.static("uploads"));

const server = createSocket(app);
const io = server.io;

app.use("/", createRouter(io));

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404, "Not Found"));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isDevelopment = req.app.get("env") === "development";
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(err);

  const errorResponse: { message: string; stack?: string } = {
    message: message,
  };

  if (isDevelopment && err.stack) {
    errorResponse.stack = err.stack;
  }
  res.status(statusCode).json(errorResponse);
});

server.server.listen(3000, () => console.log("Server Started"));

export default server;
