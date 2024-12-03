const returnSales = require('../models/returnLoss.model');

const findReturnLossById = async (id) => {
    return await returnSales.findByPk(id);
};

module.exports = {
    findReturnLossById
};
