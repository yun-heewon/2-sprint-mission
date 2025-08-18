import { Prisma } from "@prisma/client";
import { ProductRepository } from "../repositories/productRepository";
import { ProductLikeRepository } from "../repositories/productLikeRepository";
import {
  CreateProductDto,
  PatchProductDto,
  ProductListOptions,
  ProductOutput,
  ProductOutputWithLiked,
} from "../dtos/products.dto";

export class ProductService {
  private productRepository: ProductRepository;
  private productLikeRepository: ProductLikeRepository;

  constructor(
    productRepository: ProductRepository,
    productLikeRepository: ProductLikeRepository
  ) {
    this.productRepository = productRepository;
    this.productLikeRepository = productLikeRepository;
  }
  async createProduct(
    userId: number,
    productData: CreateProductDto
  ): Promise<ProductOutput> {
    const createData: Prisma.ProductCreateInput = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      tags: productData.tags,
      user: {
        connect: { id: userId },
      },
    };

    const newProduct = await this.productRepository.create(createData);

    return { ...newProduct };
  }

  async updateProduct(
    userId: number,
    productId: number,
    productData: PatchProductDto
  ): Promise<ProductOutput> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.userId !== userId) {
      throw new Error("Unauthorized to update this product");
    }

    const productUpdateData: Prisma.ProductUpdateInput = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      tags: productData.tags,
    };

    const updateProduct = await this.productRepository.update(
      productId,
      productUpdateData
    );
    if (!updateProduct) {
      throw new Error("Product update failed");
    }

    return { ...updateProduct };
  }

  async deleteProduct(userId: number, productId: number) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.userId !== userId) {
      throw new Error("Unauthorized to delete this product");
    }

    await this.productRepository.delete(productId);

    return { message: "Product deleted successfully" };
  }

  async myProducts(
    userId: number,
    options: ProductListOptions
  ): Promise<ProductOutput[]> {
    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (options.order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }
    const myProducts = await this.productRepository.findManyByUserId(userId, {
      skip: options.offset,
      take: options.limit,
      orderBy: orderBy,
    });
    return myProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      likeCount: product.likeCount,
      userId: product.userId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }

  async getProductList(
    userId: number,
    options: ProductListOptions
  ): Promise<ProductOutputWithLiked[]> {
    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (options.order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    //상품 목록 가져오기
    const getProductList = await this.productRepository.findManyProducts({
      skip: options.offset,
      take: options.limit,
      orderBy: orderBy,
    });

    //로그인한 사용자가 좋아요 누른 상품 목록 가져오기
    const myLikedProduct = await this.productLikeRepository.findManyByUserId(
      userId
    );

    // 좋아요 누른 상품 ID를 Set으로 변환
    const likedProductIds = new Set(
      myLikedProduct.map((like) => like.productId)
    );

    //전체 상품 목록에 isLiked 추가
    const productsWithLikedStatus: ProductOutputWithLiked[] =
      getProductList.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        tags: product.tags,
        likeCount: product.likeCount,
        userId: product.userId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        isLiked: likedProductIds.has(product.id),
      }));
    return productsWithLikedStatus;
  }

  async myProductsLiked(
    userId: number,
    options: ProductListOptions
  ): Promise<ProductOutputWithLiked[]> {
    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (options.order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const likedProducts =
      await this.productLikeRepository.findLikedProductsByUserId(userId, {
        skip: options.offset,
        take: options.limit,
        orderBy: orderBy,
      });

    const productsWithLikedStatus: ProductOutputWithLiked[] = likedProducts.map(
      (item) => ({
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        tags: item.product.tags,
        likeCount: item.product.likeCount,
        userId: item.product.userId,
        createdAt: item.product.createdAt,
        updatedAt: item.product.updatedAt,
        isLiked: true,
      })
    );
    return productsWithLikedStatus;
  }
}
