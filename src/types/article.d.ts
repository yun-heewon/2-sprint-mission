import { Prisma } from "@prisma/client";

export interface CreateArticleDto {
    title: string;
    content: string;
}

export interface PatchArticleDto extends Partial<CreateArticleDto> { };

export interface ArticleOutput {
    id: number;
    title: string;
    content: string;
    userId: number;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ArticleOutputWithLiked extends ArticleOutput {
    isLiked: boolean;
}

export type ArticleFindManyOptions = {
    skip?: number;
    take?: number;
    orderBy?: Prisma.ArticleOrderByWithRelationInput
};

export type LikedArticleFindManyOptions = {
    skip?: number;
    take?: number;
    orderBy?: Prisma.ArticleLikeOrderByWithRelationInput
};

export interface ArticleListOptions {
    offset?: number;
    limit?: number;
    order?: 'newest' | 'oldest';
}