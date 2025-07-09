import e from "express";
import { object, number, string, partial, array } from "superstruct";

export const CreateProduct = object({
    name: string(),
    description: string(),
    price: number(),
    tags: array(string()),
});

export const PatchProduct = partial(CreateProduct)

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
