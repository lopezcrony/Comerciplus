const detailCreditService = require('../services/detailCredit.service');

const getAllDetailCredit = async (req, res) => {
    try {
        const { idCredito } = req.params;
        const detailCredit = await detailCreditService.getAllDetailCredit(idCredito);
        if (detailCredit.length === 0) {
            return res.status(404).json({ message: 'CONTROLLER: No se encontraron ventas asociadas a este crédito.' });
        }
        return res.status(200).json(detailCredit);
    } catch (error) {
        return res.status(500).json({ message: 'CONTROLLER: Error al obtener el detalle del crédito.', error: error.message });
    }
};

const addVentaToCredito = async (req, res) => {
    try {
        const newDetailCredit = await detailCreditService.addVentaToCredito(req.body);
        res.status(200).json({ message: 'Venta asociada con éxito.', newDetailCredit });
    } catch (error) {
        res.status(500).json({ message: 'Error al asociar la venta al crédito.', error: error.message });
    }
};

const deleteDetailCredit = async (req, res) => {
    try {
        const { id } = req.params;
        await installmentService.deleteOneInstallment(id);
        res.status(200).json({ message: 'Eliminación exitosa.' });

    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER:', error: error.message });
    }
};

module.exports = {
    getAllDetailCredit,
    addVentaToCredito,
    deleteDetailCredit
}