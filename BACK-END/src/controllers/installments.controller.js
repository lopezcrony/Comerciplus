const installmentService = require('../services/installments.service');

const getInstallmentsByCredit = async (req, res) => {
    try {
        const { idCredito } = req.params;
        const installments = await installmentService.getInstallmentsByCredit(idCredito);
        if (installments.length === 0) {
            return res.status(404).json({ message: 'No se encontraron abonos para el crédito especificado' });
        }
        return res.status(200).json(installments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createInstallment = async (req, res) => {
    try {
        const newInstallment = await installmentService.createInstallment(req.body);
        res.status(200).json({ message: 'Abono creado con éxito.', newInstallment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateInstallment = async (req, res) => {
    try {
        const { id } = req.params;
        const installmentData = req.body;
        const updatedInstallment = await installmentService.updateInstallment(id, installmentData);
        res.status(200).json({ message: 'Abono actualizado con éxito.', updatedInstallment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelInstallment = async (req, res) => {
    try {
        const { id } = req.params;
        await installmentService.cancelInstallment(id);

        res.status(200).json({ message: 'Abono anulado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getInstallmentsByCredit,
    createInstallment,
    updateInstallment,
    cancelInstallment
};