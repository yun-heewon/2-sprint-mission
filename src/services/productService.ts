import { Prisma } from "@prisma/client";
import productRepository from "../repositories/productRepository";
import productLikeRepository from "../repositories/productLikeRepository";
import { CreateProductDto, PatchProductDto, ProductOutput } from "../dtos/products.dto";

export class ProductService {

    async createProduct(userId: number, productData: CreateProductDto): Promise<ProductOutput> {

        const createData: Prisma.ProductCreateInput = {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            tags: productData.tags,
            user: {
                connect: { id: userId }
            },
        };

        const newProduct = await productRepository.create(createData);

        return {
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            tags: newProduct.tags,
            likeCount: newProduct.likeCount,
            userId: newProduct.userId,
            createdAt: newProduct.createdAt,
            updatedAt: newProduct.updatedAt
        };
    }

    async updateProduct(userId: number, productId: number, productData: PatchProductDto): Promise<ProductOutput> {
        const product = await productRepository.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        if (product.userId !== userId) {
            throw new Error('Unauthorized to update this product');

        }

        const productUpdateData: Prisma.ProductUpdateInput = {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            tags: productData.tags,
        };

        const updateProduct = await productRepository.update(productId, productUpdateData);
        if (!updateProduct) {
            throw new Error('Product update failed');
        }

        return {
            id: updateProduct.id,
            name: updateProduct.name,
            description: updateProduct.description,
            price: updateProduct.price,
            tags: updateProduct.tags,
            likeCount: updateProduct.likeCount,
            userId: updateProduct.userId,
            createdAt: updateProduct.createdAt,
            updatedAt: updateProduct.updatedAt
        };
    }


    async deleteProduct(userId: number, productId: number) {
        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.userId !== userId) {
            throw new Error('Unauthorized to delete this product')
        }

        await productRepository.delete(productId);

        return { message: 'Product deleted successfully' };
    }

    async myProducts(userId: number,
        options: {
            offset?: number;
            limit?: number;
            order?: 'newest' | 'oldest';
        }
    ) {
        let orderBy: Prisma.ArticleOrderByWithRelationInput;
        switch (options.order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        };
        const myProducts = await productRepository.findManyByUserId(userId);
        return myProducts;
    }

    async getProductList(userId: number,
        options: {
            offset?: number;
            limit?: number;
            order?: 'newest' | 'oldest';
        }
    ) {
        let orderBy: Prisma.ProductOrderByWithRelationInput;
        switch (options.order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        };

        //상품 목록 가져오기 
        const getProductList = await productRepository.findManyProducts({
            skip: options.offset,
            take: options.limit,
            orderBy: orderBy,
        });

        //로그인한 사용자가 좋아요 누른 상품 목록 가져오기
        const myLikedProduct = await productLikeRepository.findManyByUserId(userId);

        // 좋아요 누른 상품 ID를 Set으로 변환
        const likedProductIds = new Set(myLikedProduct.map(like => like.productId));

        //전체 상품 목록에 isLiked 추가 
        const productLiked = getProductList.map(product => ({
            ...product,
            isLiked: likedProductIds.has(product.id),
        }));
        return productLiked
    }

    async myProductsLiked(userId: number,
        options: {
            offset?: number;
            limit?: number;
            order?: 'newest' | 'oldest';
        }
    ) {
        let orderBy: Prisma.ProductOrderByWithRelationInput;
        switch (options.order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        };

        const likedProducts = await productLikeRepository.findLikedProductsByUserId(userId, {
            skip: options.offset,
            take: options.limit,
            orderBy: orderBy,
        });

        const products = likedProducts.map(item => ({
            ...item.product,
            isLiked: true,
        }));
        return products
    }
}




export default new ProductService();