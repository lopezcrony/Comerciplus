const shoppingDetailsRepository = require('../repositories/shoppingdetails.repository');
const productosRepository = require('../repositories/products.repository');
const { sequelize } = require('../config/db');

const getAllShoppingDetails = async () => {
    try {
        return await shoppingDetailsRepository.findAllShoppingDetails();
    } catch (error) {
        throw error;
    }
};

const getOneShoppingDetail = async (id) => {
    try {
        return await shoppingDetailsRepository.findShoppingDetailById(id);
    } catch (error) {
        throw error;
    }
};

const createShoppingDetail = async (shoppingDetailData) => {
    const t = await sequelize.transaction();
    try {
        const newDetail = await shoppingDetailsRepository.createShoppingDetail(shoppingDetailData, { transaction: t });

        // Actualizar el stock del producto
        const producto = await productosRepository.findProductById(shoppingDetailData.idProducto, { transaction: t });
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        const nuevoStock = producto.stock + shoppingDetailData.cantidadProducto;
        await productosRepository.updateProductoStock(producto.idProducto, nuevoStock, { transaction: t });

        await t.commit();
        return newDetail;
    } catch (error) {
        await t.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe un detalle de compra con ese número de factura.');
        }
        throw error;
    }
};

const updateShoppingDetail = async (id, shoppingDetailData) => {
    try {
        const result = await shoppingDetailsRepository.updateShoppingDetail(id, shoppingDetailData);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar la información del detalle de la compra.');
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El detalle de la compra ya está registrado.');
        }
        throw error;
    }
};

const deleteOneShoppingDetail = async (id) => {
    try {
        const result = await shoppingDetailsRepository.deleteShoppingDetail(id);
        if (result === 0) {
            throw new Error('Detalle de la compra no encontrado');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllShoppingDetails,
    getOneShoppingDetail,
    createShoppingDetail,
    updateShoppingDetail,
    deleteOneShoppingDetail,
};
