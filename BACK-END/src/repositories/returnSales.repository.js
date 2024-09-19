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

const updateReturnSalesStatus = async (id, status) => {

    const ReturnSales = await findReturnSalesById(id);
    if (ReturnSales) {
        return await ReturnSales.update({estado : status});
    }
    throw new Error('Devolucion por Venta no encontrada');
};

module.exports = {
    findAllReturnSales,
    findReturnSalesById,
    createreturnSales,
    updateReturnSalesStatus
};
