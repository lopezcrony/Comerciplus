const productService = require('../services/products.service')

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOneProduct = async (req, res) => {
    try {
        const product = await productService.getOneProduct(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const newproduct = await productService.createProduct(req.body);
        res.status(201).json({ message: 'Producto registrado exitosamente.', newproduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({ message: 'Producto actualizado exitosamente', updatedProduct});
    } catch (error) {
        if (error.message === 'El nombre del producto ya está registrado.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

const updateProductStatus  = async (req, res) => {
    try {
        let { estadoProducto } = req.body;

        if (estadoProducto === '0' || estadoProducto === 0) {
            estadoProducto = false;
        } else if (estadoProducto === '1' || estadoProducto === 1) {
            estadoProducto = true;
        } else if (estadoProducto === true || estadoProducto === false) {
            
        } else {
            return res.status(400).json({ message: 'El estado debe ser un valor booleano' });
        }
        await productService.updateProductStatus (req.params.id, estadoProducto);
        res.json({ message: 'Estado actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOneProduct = async (req, res) => {
    try {
        const product = await productService.deleteOneProduct(req.params.id);
        if(product){
        res.json({ message: 'Producto eliminado con éxito.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteOneProduct
}