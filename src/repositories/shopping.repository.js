const { sequelize } = require('../config/db');
const Shopping = require('../models/shopping.model');
const ShoppingDetails = require('../models/shoppingdetails.model');
const Product = require('../models/products.model');

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

const createShoppingWithDetails = async (shoppingData, detailsData) => {
    const transaction = await sequelize.transaction();
    try {
        const newShopping = await Shopping.create(shoppingData, { transaction });

        for (const detail of detailsData) {
            detail.idCompra = newShopping.idCompra;

            const product = await Product.findByPk(detail.idProducto, { transaction });
            if (!product) {
                throw new Error(`Producto con ID ${detail.idProducto} no encontrado`);
            }

            const nuevoStock = product.stock + detail.cantidadProducto;
            await product.update({ stock: nuevoStock }, { transaction });

            await ShoppingDetails.create(detail, { transaction });
        }

        await transaction.commit();
        return newShopping;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    findAllShoppings,
    findShoppingById,
    createShopping,
    updateShopping,
    updateShoppingStatus,
    deleteShopping,
    createShoppingWithDetails
};
