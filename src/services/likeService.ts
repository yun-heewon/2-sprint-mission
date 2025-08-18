import userReporitory from "../repositories/userReporitory";
import productRepository from "../repositories/productRepository";
import articleReporitory from "../repositories/articleReporitory";
import productLikeRepository from "../repositories/productLikeRepository";
import articleLikeReporitory from "../repositories/articleLikeReporitory";
import { Server as SocketIOServer } from "socket.io";

export class LikeService {
  private io: SocketIOServer;
  constructor(io: SocketIOServer) {
    this.io = io;
  }

  async updateProductLike(userId: number, productId: number) {
    const user = await userReporitory.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const existingLike = await productLikeRepository.checkingProductLikeStatus(
      userId,
      productId
    );
    let message: string;
    let isLiked: boolean;
    let likeCount: number;

    if (existingLike) {
      await productLikeRepository.deleteProductLike(existingLike.id);
      const updatedProduct = await productRepository.updateLikeDecrease(
        productId
      );
      message = "Product unliked successfully";
      isLiked = false;
      likeCount = updatedProduct.likeCount;
    } else {
      await productLikeRepository.uploadProductLike(userId, productId);
      const updatedProduct = await productRepository.updateLikeIncrease(
        productId
      );
      message = "Product liked successfully";
      isLiked = true;
      likeCount = updatedProduct.likeCount;
    }
    return { message, isLiked, likeCount };
  }

  async updateArticleLike(userId: number, articleId: number) {
    const user = await userReporitory.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const article = await articleReporitory.findById(articleId);
    if (!article) {
      throw new Error("Article not found");
    }

    const existingLike = await articleLikeReporitory.checkingArticleLikeStatus(
      userId,
      articleId
    );
    let message: string;
    let isLiked: boolean;
    let likeCount: number;

    if (existingLike) {
      await articleLikeReporitory.deleteArticleLike(existingLike.id);
      const updatedArticle = await articleReporitory.updateLikeDecrease(
        articleId
      );
      message = "Article unliked successfully";
      isLiked = false;
      likeCount = updatedArticle.likeCount;
    } else {
      await articleLikeReporitory.uploadArticleLike(userId, articleId);
      const updatedArticle = await articleReporitory.updateLikeIncrease(
        articleId
      );
      message = "Article liked successfully";
      isLiked = true;
      likeCount = updatedArticle.likeCount;
    }
    return { message, isLiked, likeCount };
  }
}
