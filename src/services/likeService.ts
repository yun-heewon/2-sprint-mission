import likeRepository from "../repositories/likeRepository";
import userReporitory from "../repositories/userReporitory";
import productRepository from "../repositories/productRepository";
import articleReporitory from "../repositories/articleReporitory";

export class LikeService {
    async updateProductLike(userId: number, productId: number) {
        const user = await userReporitory.findById(userId);
        if (!user) {
            throw new Error('User not found')
        };

        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found')
        };

        const existingLike = await likeRepository.checkingProductLikeStatus(userId, productId);
        let message: string;
        let isLiked: boolean;
        let likeCount: number;

        if (existingLike) {
            await likeRepository.deleteProductLike(existingLike.id);
            const updatedProduct = await productRepository.updateLikeDecrease(productId);
            message = 'Product unliked successfully'
            isLiked = false;
            likeCount = updatedProduct.likeCount;
        } else {
            await likeRepository.uploadProductLike(userId, productId);
            const updatedProduct = await productRepository.updateLikeIncrease(productId);
            message = 'Product liked successfully';
            isLiked = true;
            likeCount = updatedProduct.likeCount;
        }
        return { message, isLiked, likeCount };
    }

    async updateArticleLike(userId: number, articleId: number) {
        const user = await userReporitory.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const article = await articleReporitory.findById(articleId);
        if (!article) {
            throw new Error('Article not found');
        }

        const existingLike = await likeRepository.checkingArticleLikeStatus(userId, articleId);
        let message: string;
        let isLiked: boolean;
        let likeCount: number;

        if (existingLike) {
            await likeRepository.deleteArticleLike(existingLike.id);
            const updatedArticle = await articleReporitory.updateLikeDecrease(articleId);
            message = 'Article unliked successfully';
            isLiked = false;
            likeCount = updatedArticle.likeCount;
        } else {
            await likeRepository.uploadArticleLike(userId, articleId);
            const updatedArticle = await articleReporitory.updateLikeIncrease(articleId);
            message = 'Article liked successfully';
            isLiked = true;
            likeCount = updatedArticle.likeCount;
        }
        return { message, isLiked, likeCount };
    }
}

export default new LikeService();