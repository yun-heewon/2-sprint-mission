import { object, string, partial, size } from "superstruct";

export const CreateArticle = object({
    title: size(string(), 1, 30),
    content: size(string(), 1, 1000),
});

export const PatchArticle = partial(CreateArticle);


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