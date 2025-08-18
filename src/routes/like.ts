import { Router } from "express";
import passport from "../lib/passport";
import { Server as SocketIOServer } from "socket.io";
import { LikeService } from "../services/likeService";
import { LikeController } from "../controllers/likeController";

const LikeRouter = (io: SocketIOServer): Router => {
  const router = Router();

  const likeService = new LikeService(io);
  const likeController = new LikeController(likeService);

  router.post(
    "/products/:productId",
    passport.authenticate("access-token", { session: false }),
    likeController.uploadLikeProduct
  );
  router.post(
    "/articles/:articleId",
    passport.authenticate("access-token", { session: false }),
    likeController.uploadLikeArticle
  );

  return router;
};

export default LikeRouter;
