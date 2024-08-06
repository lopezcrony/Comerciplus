const shoppingdetails = require('../models/shoppingdetails.model');

const findAllShoppingDetails = async () => {
    return await shoppingdetails.findAll();
};

const findShoppingDetailById = async (id) => {
    return await shoppingdetails.findByPk(id);
};

const createShoppingDetail = async (shoppingDetailData, options={}) => {
    return await shoppingdetails.create(shoppingDetailData, options);
};

const updateShoppingDetail = async (id, shoppingDetailData) => {
    const shoppingDetail = await findShoppingDetailById(id);
    if (shoppingDetail) {
        return await shoppingDetail.update(shoppingDetailData);
    }
    throw new Error('Detalle de Compra no encontrada');
};


const deleteShoppingDetail = async (id) => {
    const result = await shoppingdetails.destroy({
        where: { 	idDetalleCompra  : id }
    });
    return result;
};


module.exports = {
    findAllShoppingDetails,
    findShoppingDetailById,
    createShoppingDetail,
    updateShoppingDetail,
    deleteShoppingDetail,
};
