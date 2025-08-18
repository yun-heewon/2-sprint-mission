import { Router } from "express";
import passport from "../lib/passport/index";
import { CommentDto } from "../dtos/comments.dto";
import { validateDto } from "../lib/validator";
import { Server as SocketIOServer } from "socket.io";
import { ProductCommentService } from "../services/productCommentService";
import { ProductCommentController } from "../controllers/productCommentController";

const ProductCommentRouter = (io: SocketIOServer): Router => {
  const router = Router();

  const productCommentService = new ProductCommentService(io);
  const productCommentController = new ProductCommentController(
    productCommentService
  );

  router.post(
    "/:productId/create",
    passport.authenticate("access-token", { session: false }),
    validateDto(CommentDto),
    productCommentController.createProductComment
  );
  router.patch(
    "/:commentId/update",
    passport.authenticate("access-token", { session: false }),
    validateDto(CommentDto),
    productCommentController.updateProductComment
  );
  router.delete(
    "/:commentId",
    passport.authenticate("access-token", { session: false }),
    productCommentController.deleteProductComment
  );

  return router;
};

export default ProductCommentRouter;
