const detailSalesRepository = require('../repositories/detailSales.repository');

const getAlldetailSales = async () => {
    try {
        return await detailSalesRepository.findAlldetailSale();
    } catch (error) {
        throw error;
    }
};

const getOnedetailSales = async (id) => {
    try {
        return await detailSalesRepository.finddetailSalesById(id);
    } catch (error) {
        throw error;
    }
};

const createdetailSales = async (detailSalesData) => {
    try {
        return await detailSalesRepository.createdetailSale(detailSalesData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe detalle de venta con esa información.');
        }
        throw error;
    }
};

module.exports = {
    getAlldetailSales,
    getOnedetailSales,
    createdetailSales,    
};
