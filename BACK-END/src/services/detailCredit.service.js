const detailCreditRepository = require('../repositories/detailCredit.repository');
const creditRepository = require('../repositories/credits.repository');
const salesRepository = require('../repositories/sales.repository');

const { sequelize } = require('../config/db');

const getAllDetailCredit = async (idCredit) => {
    try {
        return await detailCreditRepository.getAllDetailCredit(idCredit);
    } catch (error) {
        throw new Error('SERVICE:' + error.message);
    }
};

const addSaleToCredit = async (creditDetailData) => {
    const transaction = await sequelize.transaction();
    try {
        // Busca la venta 
        const venta = await salesRepository.findSalesById(creditDetailData.idVenta, { transaction });
        
        if (!venta) {
            throw new Error('Venta no encontrada');
        }

        // Validar que el monto acreditado no sea superior al total de la venta
        if (creditDetailData.montoAcreditado > venta.totalVenta) {
            throw new Error('El monto acreditado no puede ser superior al total de la venta');
        }
        const newDetailCredit = await detailCreditRepository.addSaleToCredit(creditDetailData, { transaction });

        const credit = await creditRepository.findCreditById(creditDetailData.idCredito, { transaction });

        const newTotalCredit = credit.totalCredito + newDetailCredit.montoAcreditado;

        await creditRepository.updateTotalCredit(creditDetailData.idCredito, newTotalCredit, { transaction });

        await transaction.commit();
        return newDetailCredit;
    } catch (error) {
        //Deshace todo
        await transaction.rollback();
        throw new Error('SERVICE:' + error.message);
    }
};

const deleteDetailCredit = async (id) => {
    try {
        return await detailCreditRepository.deleteOneDetailCredit(id);
    } catch (error) {
        throw error;
    }
};
    
module.exports = {
    getAllDetailCredit,
    addSaleToCredit,
    deleteDetailCredit
};