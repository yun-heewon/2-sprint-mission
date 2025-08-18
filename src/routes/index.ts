import express, { Router } from "express";

import usersRouter from "./users";
import productsRouter from "./products";
import articlesRouter from "./articles";
import articleCommentsRouter from "./articleComments";
import productCommentsRouter from "./productComments";
import documentsRouter from "./documents";
import likeRouter from "./like";
import { Server } from "socket.io";
import prisma from "../lib/prisma";

const createRouter = (io: Server): Router => {
  const router = express.Router();

  router.use("/users", usersRouter());
  router.use("/products", productsRouter());
  router.use("/articles", articlesRouter());
  router.use("/articles/comments", articleCommentsRouter(io));
  router.use("/products/comments", productCommentsRouter(io));
  router.use("/documents", documentsRouter());
  router.use("/likes", likeRouter(io));
  router.use("/files", express.static("uploads"));

  router.get("/", (req, res) => {
    res.status(200).json({ message: "welcome!" });
  });
  return router;
};

export default createRouter;
