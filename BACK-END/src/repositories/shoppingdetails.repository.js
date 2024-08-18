const shoppingDetails = require('../models/shoppingdetails.model');

const findByCompraId = async (idCompra) => {
    return await shoppingDetails.findAll({
        where: { idCompra }
    });
};

const findAllShoppingDetails = async () => {
    return await shoppingDetails.findAll();
};

const findShoppingDetailById = async (id) => {
    return await shoppingDetails.findByPk(id);
};

const createShoppingDetail = async (shoppingdetailData) => {
    return await shoppingDetails.create(shoppingdetailData);
};

const updateShoppingDetail = async (id, shoppingdetailData) => {
    const shoppingdetail = await findShoppingDetailById(id);
    if (shoppingdetail) {
        return await shoppingdetail.update(shoppingdetailData);
    }
    throw new Error('detalle de compra no encontrado');
};

const findShoppingDetailByCompraAndProducto = async (idCompra, idProducto, codigoBarra) => {
    return await shoppingDetails.findOne({
        where: {
            idCompra,
            idProducto,
            codigoBarra
        }
    });
};


const deleteShoppingDetail = async (id) => {
    const result = await shoppingDetails.destroy({
        where: { 	idDetalleCompra : id }
    });
    return result;
};


module.exports = {
    findAllShoppingDetails,
    findShoppingDetailById,
    createShoppingDetail,
    updateShoppingDetail,
    deleteShoppingDetail,
    findShoppingDetailByCompraAndProducto,
    findByCompraId
};
