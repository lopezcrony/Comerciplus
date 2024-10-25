const Shopping = require('../models/shopping.model');

const findAllShoppings = async () => {
    return await Shopping.findAll();
};

const findShoppingById = async (id = {}) => {
    return await Shopping.findByPk(id);
};

const createShopping = async (shoppingData, options) => {
    return await Shopping.create(shoppingData, options);
};

const updateValorShopping = async (id, newTotalShopping) => {
    const shopping = await findShoppingById(id);
    if (shopping) {
        return await sale.update({ valorCompra: newTotalShopping });
    }
    throw new Error('REPOSITORY: La compra no existe.');
};

const deleteShopping = async (id) => {
    const result = await Shopping.destroy({
        where: { idCompra: id }
    });
    return result;
};

const cancelShopping = async (id) => {
    return Shopping.update(
        { estadoCompra: false }, 
        { where: { idCompra: id } }
    );
};

module.exports = {
    findAllShoppings,
    findShoppingById,
    createShopping,
    deleteShopping,
    updateValorShopping,
    cancelShopping
};
