const Installment = require('../models/installments.model');

const registerInstallment = async (installmentData) => {
    try {
        return await Installment.create(installmentData);
    } catch (error) {
        throw new Error('REPOSITORY: Error al registrar abono: ' + error.message);
    }
};

const getInstallmentsByCredit = async (idCredit) => {
    try {
        return await Installment.findAll({
            where: { idCredito: idCredit }
        });
    } catch (error) {
        throw new Error('REPOSITORY: Error al obtener abonos por crédito: ' + error.message);
    }
};

const updateInstallment = async (id, installmentData) => {
    try {
        const installment = await Installment.findByPk(id);
        if (installment) {
            return await installment.update(installmentData);
        }
        throw new Error('REPOSITORY: Abono no encontrado');
    } catch (error) {
        throw new Error('REPOSITORY: Error al actualizar abono: ' + error.message);
    }
};

const deleteOneInstallment = (id) => {
    const result = Installment.destroy({
        where: { idAbono : id }
    });
    return result;
};

module.exports = {
    registerInstallment,
    getInstallmentsByCredit,
    updateInstallment,
    deleteOneInstallment
};