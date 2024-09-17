const Sales = require('../models/sales.model');

const findAllSales = async () => {
    return await Sales.findAll();
};

const findSalesById = async (id) => {
    return await Sales.findByPk(id);
};

const createSales = async (salesData, options) => {
    return await Sales.create(salesData, options);
};

const updateTotalSale = async (id, newTotalSale) => {
    const sale = await findSalesById(id);
    if(sale){
        return await sale.update({ totalVenta : newTotalSale});
    }
    throw new Error('REPOSITORY: La venta no existe.');
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
    updateTotalSale,
    updateSalesStatus,
};
