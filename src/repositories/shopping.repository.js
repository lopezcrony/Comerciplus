const Shopping = require('../models/shopping.model');

const findAllShoppings = async () => {
    return await Shopping.findAll();
};

const findShoppingById = async (id = {}) => {
    return await Shopping.findByPk(id);
};

const createShopping = async (shoppingData) => {
    return await Shopping.create(shoppingData);
};

const updateValorShopping = async (id, newTotalShopping) => {
    const shopping = await findShoppingById(id);
    if(shopping){
        return await sale.update({ valorCompra : newTotalShopping});
    }
    throw new Error('REPOSITORY: La compra no existe.');
};

const updateShoppingStatus = async (id, status) => {
    const shopping = await findProductById(id);
    if (shopping) {
        return await shopping.update({ estadoCompra: status });
    }
    throw new Error('REPOSITORY: Compra no encontrada');
};


module.exports = {
    findAllShoppings,
    findShoppingById,
    createShopping,
    updateValorShopping,
    updateShoppingStatus
};
