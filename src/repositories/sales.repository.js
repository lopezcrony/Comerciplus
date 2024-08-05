const Sales = require('../models/sales.model');
const Provider = require('../models/sales.model');

const findAllSales = async () => {
    return await Sales.findAll();
};

const findSalesById = async (id) => {
    return await Sales.findByPk(id);
};

const createSales = async (salesData) => {
    return await Sales.create(salesData);
};

const updateSales = async (id, salesData) => {
    const sales = await findSalesById(id);
    if (sales) {
        return await sales.update(salesData);
    }
    throw new Error('Venta no encontrada');
};

const updateSalesStatus = async (id, status) => {

    const sales = await findSalesById(id);
    if (sales) {
        return await sales.update({estadoVenta : status});
    }
    throw new Error('Venta no encontrada');
};


module.exports = {
    findAllSales,
    findSalesById,
    createSales,
    updateSales,
    updateSalesStatus,
};
