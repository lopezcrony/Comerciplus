const { request, response } = require('express')
const { GetAllProductsService, GetOneProductService, CreateNewProductService, updateOneProductService, deleteOneProductService } = require('../services/products.service');

const GetAllProductsController = async (request, response) => {
    try {
        const products = await GetAllProductsService();
        response.json(products);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener los productos', error });
    }
};

const GetOneProductController = async (request, response) => {
    try {
        const { id } = request.params
        const product = await GetOneProductService(id);

        if (product) {
            response.json(product);
        } else {
            response.status(404).json({ message: 'Producto no encontrado' })
        }
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
};

const CreateNewProductController = async (request, response) => {
    try {
        const { idCategoria,imagenProducto,nombreProducto, stock, precioVenta } = request.body;

        const newProduct = {
            idCategoria,
            imagenProducto,
            nombreProducto,
            stock,
            precioVenta
        };

        const result = await CreateNewProductService(newProduct);
        response.status(201).json({ message: 'producto creado exitosamente.' });

    } catch (error) {
        response.status(500).json({ message: 'Error al crear el producto.', error: error.message });
    }
};

const UpdateProductController = async (request, response) => {
    try {
        const { id } = request.params;
        const { idCategoria,imagenProducto,nombreProducto, stock, precioVenta } = request.body;

        const product = await GetOneProductService(id);
        if(!product){
            return response.status(404).json({ message: 'Producto no encontrado' });
        }

        const updatedProduct = {
            idProduct: id,
            idCategoria,
            imagenProducto,
            nombreProducto,
            stock,
            precioVenta
        };

        const result = await updateOneProductService(updatedProduct);

        response.status(200).json({ message: 'Producto actualizado exitosamente'});

    } catch (error) {
        response.status(500).json({ message: 'Error al actualizar el producto.', error: error.message });
    }
};

const DeleteOneProductController = async (request, response) => {
    try {
        const { id } = request.params
        const result = await deleteOneProductService(id);

        // Verifica si se eliminó algún registro
        if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Producto no encontrado.' });
        }
        response.status(200).json({ message: 'Producto eliminado con éxito.' });
        
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
}

module.exports = {
    GetAllProductsController,
    GetOneProductController,
    CreateNewProductController,
    UpdateProductController,
    DeleteOneProductController
}