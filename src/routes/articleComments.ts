import { Router } from "express";
import passport from "../lib/passport/index";
import { validateDto } from "../lib/validator";
import { CommentDto } from "../dtos/comments.dto";
import { ArtricleCommentController } from "../controllers/articleCommentController";
import { ArticleCommentService } from "../services/articleCommentService";
import { Server as SocketIOServer } from "socket.io";

const AtricleCommentRouter = (io: SocketIOServer): Router => {
  const router = Router();

  const articleCommentService = new ArticleCommentService(io);
  const articleCommentController = new ArtricleCommentController(
    articleCommentService
  );

  router.post(
    "/:articleId/create",
    passport.authenticate("access-token", { session: false }),
    validateDto(CommentDto),
    articleCommentController.createArticleComment
  );
  router.patch(
    "/:commentId/update",
    passport.authenticate("access-token", { session: false }),
    validateDto(CommentDto),
    articleCommentController.updateArticleComment
  );
  router.delete(
    "/:commentId",
    passport.authenticate("access-token", { session: false }),
    articleCommentController.deleteArticleComment
  );

  return router;
};
export default AtricleCommentRouter;
