import { object, number, string, partial, array } from "superstruct";

export const CreateProduct = object({
    name: string(),
    description: string(),
    price: number(),
    tags: array(string()),
});

export const PatchProduct = partial(CreateProduct)