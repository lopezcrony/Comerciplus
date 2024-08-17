const detailSale = require('../models/detailSale.model');

const findAlldetailSale = async () => {
    return await detailSale.findAll();
};

const finddetailSalesById = async (id) => {
    return await detailSale.findByPk(id);
};

const createdetailSale = async (salesData) => {
    return await detailSale.create(salesData);
};


module.exports = {
    findAlldetailSale,
    finddetailSalesById,
    createdetailSale,
};
