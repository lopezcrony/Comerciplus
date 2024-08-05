const shoppingDetailsRepository = require('../repositories/shoppingdetails.repository');

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
    try {
        return await shoppingDetailsRepository.createShoppingDetail(shoppingDetailData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe un detalle de compra con ese numero de factura.');
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
            throw new Error('El detalle de la compra ya esta registrada.');
        }
        throw error;
    }
};


const deleteOneShoppingDetail = async (id) => {
    try {
        const result = await shoppingDetailsRepository.deleteShoppingDetail(id);
        if (result === 0) {
            throw new Error('Detalle de la compra no encontrada');
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
