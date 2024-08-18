const salesRepository = require('../repositories/sales.repository');

const getAllSales = async () => {
    try {
        return await salesRepository.findAllSales();
    } catch (error) {
        throw error;
    }
};

const getOneSales = async (id) => {
    try {
        return await salesRepository.findSalesById(id);
    } catch (error) {
        throw error;
    }
};

const createSales = async (salesData) => {
    try {
        return await salesRepository.createSales(salesData);
    } catch (error) {
       throw error;
    }
};


const updateSalesStatus = async (id, status) => {
    try {
        const result = await salesRepository.updateSalesStatus(id, status);
        if (!result) {
            throw new Error('SERVICE: El estado de la venta no se pudo actualizar');
        }
        return result;
    } catch (error) {
        throw new Error('Error al cambiar el estado de la venta: ' + error.message);
    }
};

const updateTotalSale = async (id, newTotalSale) => {
    try {
        const result = salesRepository.updateTotalSale(id,newTotalSale);
        if(!result){
            throw new Error ('SERVICE: No se pudo actualizar el total de la venta.')
        }
        return result;
    } catch (error) {
        
    }
};

module.exports = {
    getAllSales,
    getOneSales,
    createSales,    
    updateTotalSale,
    updateSalesStatus,
};
