const Shopping = require('../models/shopping.model');

const findAllShoppings = async () => {
    return await Shopping.findAll();
};

const findShoppingById = async (id) => {
    return await Shopping.findByPk(id);
};

const createShopping = async (shoppingData) => {
    return await Shopping.create(shoppingData);
};

const updateShopping = async (id, shoppingData) => {
    const shopping = await findShoppingById(id);
    if (shopping) {
        return await shopping.update(shoppingData);
    }
    throw new Error('Compra no encontrada');
};

const updateShoppingStatus = async (id, status) => {

    const shopping = await findShoppingById(id);
    if (shopping) {
        return await shopping.update({estadoCompra  : status});
    }
    throw new Error('REPOSITORY: Compra no encontrada');
};

const deleteShopping = async (id) => {
    const result = await Shopping.destroy({
        where: { 	idCompra : id }
    });
    return result;
};


module.exports = {
    findAllShoppings,
    findShoppingById,
    createShopping,
    updateShopping,
    updateShoppingStatus,
    deleteShopping,
};
