const detailCreditRepository = require('../repositories/detailCredit.repository');
const creditRepository = require('../repositories/credits.repository');

const { sequelize } = require('../config/db');

const getAllDetailCredit = async (idCredit) => {
    try {
        return await detailCreditRepository.getAllDetailCredit(idCredit);
    } catch (error) {
        throw new Error('SERVICE:' + error.message);
    }
};

const addVentaToCredito = async (creditDetailData) => {
    const transaction = await sequelize.transaction();
    try {
        const newDetailCredit = await detailCreditRepository.addVentaToCredito(creditDetailData, { transaction });

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
    addVentaToCredito,
    deleteDetailCredit
};