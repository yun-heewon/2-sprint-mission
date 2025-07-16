const { object, number, string, partial, array } = require("superstruct");

const CreateProduct = object({
    name: string(),
    description: string(),
    price: number(),
    tags: array(string()),
    userId: number()
});

const PatchProduct = partial(CreateProduct)


module.exports = {
    CreateProduct, PatchProduct
};
