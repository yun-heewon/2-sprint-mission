import express, { Router } from "express";
const router = express.Router();
import passport from "../lib/passport/index";
import { CreateProductDto, PatchProductDto } from "../dtos/products.dto";
import { validateDto } from "../lib/validator";
import { ProductService } from "../services/productService";
import { ProductController } from "../controllers/productController";

const ProductRouter = (): Router => {
  const router = Router();

  const productService = new ProductService();
  const productController = new ProductController(productService);

  router.post(
    "/create",
    passport.authenticate("access-token", { session: false }),
    validateDto(CreateProductDto),
    productController.createProduct
  );
  router.patch(
    "/update/:id",
    passport.authenticate("access-token", { session: false }),
    validateDto(PatchProductDto),
    productController.updateProduct
  );
  router.delete(
    "/:id",
    passport.authenticate("access-token", { session: false }),
    productController.deleteProduct
  );
  router.get(
    "/my-product",
    passport.authenticate("access-token", { session: false }),
    productController.getMyProductList
  );
  router.get(
    "/",
    passport.authenticate("access-token", { session: false }),
    productController.getProductList
  );
  router.get(
    "/me/liked-products",
    passport.authenticate("access-token", { session: false }),
    productController.getLikedProductList
  );
  return router;
};

export default ProductRouter;
