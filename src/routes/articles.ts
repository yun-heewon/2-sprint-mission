import { Router } from "express";
import passport from "../lib/passport/index";
import { CreateArticlesDto, PatchArticleDto } from "../dtos/articles.dto";
import { validateDto } from "../lib/validator";
import { ArticleService } from "../services/articleService";
import { ArticleController } from "../controllers/articleController";

const ArticleRouter = (): Router => {
  const router = Router();

  const articleService = new ArticleService();
  const articleController = new ArticleController(articleService);

  router.post(
    "/create",
    passport.authenticate("access-token", { session: false }),
    validateDto(CreateArticlesDto),
    articleController.createArticle
  );
  router.patch(
    "/update/:id",
    passport.authenticate("access-token", { session: false }),
    validateDto(PatchArticleDto),
    articleController.updateArticle
  );
  router.delete(
    "/:id",
    passport.authenticate("access-token", { session: false }),
    articleController.deleteArticle
  );
  router.get(
    "/my-article",
    passport.authenticate("access-token", { session: false }),
    articleController.getMyArticleList
  );
  router.get(
    "/",
    passport.authenticate("access-token", { session: false }),
    articleController.getArticleList
  );

  return router;
};

export default ArticleRouter;
