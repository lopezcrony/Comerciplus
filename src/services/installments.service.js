const installmentRepository = require('../repositories/installments.repository');
const creditRepository = require('../repositories/credits.repository');
const sequelize  = require('../models');

const getInstallmentsByCredit = async (idCredit) => {
    try {
        return await installmentRepository.getInstallmentsByCredit(idCredit);
    } catch (error) {
        throw new Error('SERVICE: Error al obtener los abonos por crédito: ' + error.message);
    }
};

const createInstallment = async (installmentData) => {
    const transaction = await sequelize.transaction();
    try {
        // Crear el nuevo abono
        const newInstallment = await installmentRepository.registerInstallment(installmentData, { transaction });

        // Obtener el crédito asociado y actualizar el TotalCredito
        const credit = await creditRepository.findCreditById(installmentData.idCredito, { transaction });
        const newTotalCredit = credit.totalCredito - newInstallment.montoAbonado;
        
        if (newTotalCredit < 0) {
            throw new Error('El monto abonado no puede ser mayor que el crédito restante.');
        }

        await creditRepository.updateTotalCredit(installmentData.idCredito, newTotalCredit, { transaction });

        await transaction.commit();
        return newInstallment;
    } catch (error) {
        await transaction.rollback();
        throw new Error('SERVICE: Error al crear el abono: ' + error.message);
    }
};

const updateInstallment = async (id, installmentData) => {
    try {
        const result = await installmentRepository.updateInstallment(id, installmentData);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar el abono.');
        }
    } catch (error) {
        throw error;
    }
};

const deleteOneInstallment = async (id) => {
    try {
        const result = await installmentRepository.deleteOneInstallment(id);
        if (result === 0) {
            throw new Error('SERVICE: Abono no encontrado.');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getInstallmentsByCredit,
    createInstallment,
    updateInstallment,
    deleteOneInstallment
};
