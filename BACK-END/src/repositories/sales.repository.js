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

const cancelSale = async (id) => {
    
    return Sales.update(
        { estadoVenta: false }, 
        { where: { idVenta: id } }
    );
};

const deleteSale = async (id, transaction) => {
    return await Sales.destroy({ 
        where: { idVenta: id },
        transaction 
    });
};

module.exports = {
    findAllSales,
    findSalesById,
    createSales,
    updateTotalSale,
    cancelSale,
    deleteSale
};
