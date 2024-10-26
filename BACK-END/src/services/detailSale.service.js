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

// Busca los detalles de venta asociados a una venta en particular
const getAllDetailsBySale = async (idSale) => {
    try {
        return await detailSalesRepository.findAllDetailBySale(idSale);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAlldetailSales,
    getOnedetailSales,
    getAllDetailsBySale
};
