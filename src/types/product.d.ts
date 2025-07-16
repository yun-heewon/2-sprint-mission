import { Prisma } from "@prisma/client";

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    tags: string[];
}

export interface PatchProductDto extends Partial<CreateProductDto> { };

export interface ProductOutput {
    id: number;
    name: string;
    description: string;
    price: number;
    tags: string[];
    likeCount: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductOutputWithLiked extends ProductOutput {
    isLiked: boolean;
}

export type ProductFindManyOptions = {
    skip?: number;
    take?: number;
    orderBy?: Prisma.ProductOrderByWithRelationInput
};

export type LikedProductFindManyOptions = {
    skip?: number;
    take?: number;
    orderBy?: Prisma.ProductLikeOrderByWithRelationInput
};

export interface ProductListOptions {
    offset?: number;
    limit?: number;
    order?: 'newest' | 'oldest';
}

