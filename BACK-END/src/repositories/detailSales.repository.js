const detailSale = require('../models/detailSale.model');

const findAlldetailSale = async () => {
    return await detailSale.findAll();
};

const finddetailSalesById = async (id) => {
    return await detailSale.findByPk(id);
};

// Busca los detalles de venta asociados a una venta en particular
const findAllDetailBySale = async (idSale) => {
    return await detailSale.findAll({
        where: { idVenta: idSale }
    });
};

const deleteAllDetailsBySale = async (saleId, transaction) => {
    return await detailSale.destroy({ 
        where: { idVenta: saleId },
        transaction
    });
};

const createdetailSale = async (salesData, options) => {
    return await detailSale.create(salesData, options);
};

module.exports = {
    findAlldetailSale,
    finddetailSalesById,
    createdetailSale,
    findAllDetailBySale,
    deleteAllDetailsBySale
};
