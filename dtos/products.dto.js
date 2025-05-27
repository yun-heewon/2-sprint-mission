const { object, number, string, partial } = require("superstruct");

const CreateProduct = object({
    name: string(),
    description: string(),
    price: number(),
    tags: string(),
});

const PatchProduct = partial(CreateProduct)


module.exports = {
    CreateProduct, PatchProduct
};
