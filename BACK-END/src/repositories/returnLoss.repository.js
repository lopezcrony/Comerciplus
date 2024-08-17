const returnSales = require('../models/returnLoss.model');

const findAllReturnLoss = async () => {
    return await  returnSales.findAll();
};

const findReturnLossById = async (id) => {
    return await returnSales.findByPk(id);
};

const createreturnLoss = async (returnLossData) => {
    return await returnSales.create(returnLossData);
};

module.exports = {
    findAllReturnLoss,
    findReturnLossById,
    createreturnLoss
};
