const productRepository = require('../repositories/products.repository');

const getAllProducts = async () => {
    try {
        return await productRepository.findAllProducts();
    } catch (error) {
        throw error;
    }
};

const getOneProduct = async (id) => {
    try {
        return await productRepository.findProductById(id);
    } catch (error) {
        throw error;
    }
};

const createProduct = async (ProductData) => {
    try {
        return await productRepository.createProduct(ProductData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe un producto con ese nombre.');
        }
        throw error;
    }
};

const updateProduct = async (id, ProductData) => {
    try {
        const result = await productRepository.updateProduct(id, ProductData);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar la información del producto.');
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El producto ya esta registrado.');
        }
        throw error;
    }
};

const updateProductStatus  = async (id, status) => {
    try {
        const result = await productRepository.updateProductStatus(id, status);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar el estado del producto');
        }
        return result;
    } catch (error) {
        throw new Error('SERVICE: Error al cambiar el estado del producto: ' + error.message);
    }
}



const deleteOneProduct = async (id) => {
    try {
        const result = await productRepository.deleteProduct(id);
        if (result === 0) {
            throw new Error('producto no encontrado');
        }
        return result;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteOneProduct
};
