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

const updateValorCompra = async (id,newValorCompra) => {
    try {
        const result =  shoppingRepository.updateValorShopping(id,newValorCompra);
        if (!result) {
            throw new Error("SERVICE: no se pudo actualizar el valor de la compra.");
            
        }
        return result;
    } catch (error) {
    }
};


module.exports = {
    getAllShoppings,
    getOneShopping,
    createShopping,
    updateShoppingStatus,
    updateValorCompra
};
