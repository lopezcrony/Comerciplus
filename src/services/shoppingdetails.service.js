const shoppingDetailRepository = require('../repositories/shoppingdetails.repository');

const getAllShoppingDetails = async () => {
    try {
        return await shoppingDetailRepository.findAllShoppingDetails();
    } catch (error) {
        throw error;
    }
};

const getOneShoppingDetail = async (id) => {
    try {
        return await shoppingDetailRepository.findShoppingDetailById(id);
    } catch (error) {
        throw error;
    }
};

const createShoppingDetail = async (shoppingdetailData) => {
    try {
        const existingDetail = await shoppingDetailRepository.findShoppingDetailByCompraAndProducto(
            shoppingdetailData.idCompra, 
            shoppingdetailData.idProducto,
            shoppingdetailData.codigoBarra
        );

        if (existingDetail) {
            throw new Error('Ya existe un detalle de compra con este producto y código de barra para la misma compra.');
        }

        return await shoppingDetailRepository.createShoppingDetail(shoppingdetailData);
    } catch (error) {
        throw error;
    }
};


const updateShoppingDetail = async (id, ShoppingdetailData) => {
    try {
        const result = await shoppingDetailRepository.updateShoppingDetail(id, ShoppingdetailData);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar la información del detalle de la compra.');
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El detalle ya esta registrado.');
        }
        throw error;
    }
};


const deleteOneShoppingDetail = async (id) => {
    try {
        const result = await shoppingDetailRepository.deleteShoppingDetail(id);
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
