import { Prisma } from "@prisma/client";
import userReporitory from "../repositories/userReporitory";
import productRepository from "../repositories/productRepository";
import productCommentRepository from "../repositories/productCommentRepository";
import { CommentDto, ProductCommentOutput } from "../dtos/comments.dto";

export class ProductCommentService {
    async createProductComment(userId: number, productId: number, commentData: CommentDto): Promise<ProductCommentOutput> {
        const user = await userReporitory.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (!commentData.content || commentData.content.trim().length === 0) {
            throw new Error('Comment content cannot be empty.');
        }

        const createData: Prisma.ProductCommentCreateInput = {
            content: commentData.content,
            user: {
                connect: { id: userId }
            },
            product: {
                connect: { id: productId }
            },
        };

        const newProductComment = await productCommentRepository.create(createData);
        return {
            id: newProductComment.id,
            content: newProductComment.content,
            userId: newProductComment.userId,
            productId: newProductComment.productId,
            createdAt: newProductComment.createdAt,
            updatedAt: newProductComment.updatedAt,
        };
    }

    async updateProductComment(userId: number, productCommentId: number, updateData: CommentDto): Promise<ProductCommentOutput> {

        const user = await userReporitory.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const productComment = await productCommentRepository.findById(productCommentId);
        if (!productComment) {
            throw new Error('Product comment not found');
        }

        if (productComment.userId !== userId) {
            throw new Error('Unauthorized to update this product comment')
        }

        const productCommentUpdateData: Prisma.ProductCommentUpdateInput = {
            content: updateData.content,
        };

        const updateProductComment = await productCommentRepository.update(productCommentId, productCommentUpdateData);

        return {
            id: updateProductComment.id,
            content: updateProductComment.content,
            userId: updateProductComment.userId,
            productId: updateProductComment.productId,
            createdAt: updateProductComment.createdAt,
            updatedAt: updateProductComment.updatedAt,
        };
    }

    async deleteProductComment(userId: number, productCommentId: number) {
        const productComment = await productCommentRepository.findById(productCommentId);
        if (!productComment) {
            throw new Error('Product comment not found');
        }

        if (productComment.userId !== userId) {
            throw new Error('You are not authorized to delete this product comment.');
        }

        await productCommentRepository.delete(productCommentId);

        return { message: 'Product comment deleted successfully' };
    }
}

export default new ProductCommentService();