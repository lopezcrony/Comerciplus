const shoppingRepository = require('../repositories/shopping.repository');

const getAllShoppings = async () => {
    try {
        return await shoppingRepository.findAllShoppings();
    } catch (error) {
        throw error;
    }
};

const getOneShopping = async (id) => {
    try {
        return await shoppingRepository.findShoppingById(id);
    } catch (error) {
        throw error;
    }
};

const createShopping = async (shoppingData) => {
    try {
        return await shoppingRepository.createShopping(shoppingData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe una compra con ese numero de factura.');
        }
        throw error;
    }
};

const updateShopping = async (id, shoppingData) => {
    try {
        const result = await shoppingRepository.updateShopping(id, shoppingData);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar la información de la compra.');
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('La compra ya esta registrada.');
        }
        throw error;
    }
};

const updateShoppingStatus  = async (id, status) => {
    try {
        const result = await shoppingRepository.updateShoppingStatus(id, status);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar el estado de la compra');
        }
        return result;
    } catch (error) {
        throw new Error('SERVICE: Error al cambiar el estado de la compra: ' + error.message);
    }
}



const deleteOneShopping = async (id) => {
    try {
        const result = await shoppingRepository.deleteShopping(id);
        if (result === 0) {
            throw new Error('Compra no encontrada');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

const createShoppingWithDetails = async (shoppingData, detailsData) => {
    try {
        return await shoppingRepository.createShoppingWithDetails(shoppingData, detailsData);
    } catch (error) {
        throw new Error(`SERVICE: Error al crear la compra con detalles: ${error.message}`);
    }
};

module.exports = {
    getAllShoppings,
    getOneShopping,
    createShopping,
    updateShopping,
    updateShoppingStatus,
    deleteOneShopping,
    createShoppingWithDetails
};
