const ReturnProviderRepository = require('../repositories/returnSales.repository');

const getAllReturnSales = async () => {
    try {
        return await ReturnProviderRepository.findAllReturnSales();
    } catch (error) {
        throw error;
    }
};

const getOneReturnSales = async (id) => {
    try {
        return await ReturnProviderRepository.findReturnSalesById(id);
    } catch (error) {
        throw error;
    }
};

const createReturnSales = async (ReturnSalesData) => {
    try {
        return await ReturnProviderRepository.createReturnSales(ReturnSalesData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe una devolucion de venta con el mismo ID.');
        }
        throw error;
    }
};

module.exports = {
    getAllReturnSales,
    getOneReturnSales,
    createReturnSales,    
};
