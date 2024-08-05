const Products = require('../models/products.model');

const findAllProducts = async () => {
    return await Products.findAll();
};

const findProductById = async (id) => {
    return await Products.findByPk(id);
};

const createProduct = async (productData) => {
    return await Products.create(productData);
};

const updateProduct = async (id, productData) => {
    const product = await findProductById(id);
    if (product) {
        return await product.update(productData);
    }
    throw new Error('Producto no encontrado');
};

const updateProductStatus = async (id, status) => {

    const product = await findProductById(id);
    if (product) {
        return await product.update({estadoProducto : status});
    }
    throw new Error('REPOSITORY: Producto no encontrado');
};

const deleteProduct = async (id) => {
    const result = await Products.destroy({
        where: { 	idProducto: id }
    });
    return result;
};


module.exports = {
    findAllProducts,
    findProductById,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteProduct,
};
