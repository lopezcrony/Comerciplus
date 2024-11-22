const installmentRepository = require('../repositories/installments.repository');
const creditRepository = require('../repositories/credits.repository');
const {sequelize} = require('../config/db');

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
        // Busca el crédito y valida si existe
        const credit = await creditRepository.findCreditById(installmentData.idCredito, { transaction });

        // Registra un abono
        const newInstallment = await installmentRepository.registerInstallment(installmentData, { transaction });

        // Actualiza el valor total crédito
        const newTotalCredit = credit.totalCredito - newInstallment.montoAbonado;

        if (newTotalCredit < 0) {
            throw new Error('El monto abonado no puede ser mayor que el crédito restante.');
        }
        // Actualiza el valor total crédito
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

const cancelInstallment = async (id) => {
    try {
        const installment = await installmentRepository.findInstallmentById(id);
      if (!installment) {
        return res.status(404).json({ message: 'Abono no encontrado' });
      }
      
      await installmentRepository.cancelInstallment(id);
      
      // Actualizar el saldo del crédito
      const credit = await creditRepository.findCreditById(installment.idCredito);
      await creditRepository.updateTotalCredit(installment.idCredito, credit.totalCredito + installment.montoAbonado);
        
    } catch (error) {
        throw new Error('Error al anular el abono.' + error.message);
    }
};

module.exports = {
    getInstallmentsByCredit,
    createInstallment,
    updateInstallment,
    cancelInstallment
};
