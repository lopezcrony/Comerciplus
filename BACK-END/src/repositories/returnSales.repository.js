const returnSales = require('../models/returnSales.model');

const findAllReturnSales = async () => {
    return await  returnSales.findAll();
};

const findReturnSalesById = async (id) => {
    return await returnSales.findByPk(id);
};

const createreturnSales = async (returnSalesData) => {
    return await returnSales.create(returnSalesData);
};

module.exports = {
    findAllReturnSales,
    findReturnSalesById,
    createreturnSales
};
