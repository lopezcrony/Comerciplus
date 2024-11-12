const creditService = require('../services/credits.service')

const getAllCredits = async (req, res) => {
    try {
        const credits = await creditService.getAllCredits();
        res.status(200).json(credits);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los créditos', error });
    }
};

const getOneCredit = async (req, res) => {
    try {
        const credit = await creditService.getOneCredit(req.params.id);
        res.status(200).json(credit);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el crédito', error });
    }
};

const getCreditsByClient = async (req, res) => {
    try {
        const idClient = req.params.id;
        const credits = await creditService.getCreditsByClient(idClient);
        res.status(200).json(credits);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los créditos del cliente', error: error.message });
    }
}
const getCreditHistoryByClient = async (req, res) => {
    try {
        const idClient = req.params.id;
        const history = await creditService.getCreditHistoryByClient(idClient);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el historial de crédito del cliente', error: error.message });
    }
};

const createCredit = async (req, res) => {
    try {
        const newCredit = await creditService.createCredit(req.body);
        res.status(200).json({ message: 'Crédito creado con éxito.', newCredit });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el crédito.' });
    }
};

const updateTotalCredit = async (req, res) => {
    try {
        const { totalCredito } = req.body;
        await creditService.updateTotalCredit(req.params.id, totalCredito);
        res.status(200).json({ message: 'Valor total del crédito actualizado.' })
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el valor total del crédito.', error: error.message });
    }
};

const deleteOneCredit = async (req, res) => {
    try {
        const credit = await creditService.deleteOneCredit(req.params.id);
        if(credit){
        res.json({ message: 'Crédito eliminado con éxito.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER:', error: error.message });
    }
};

module.exports = {
    getAllCredits,
    getOneCredit,
    getCreditsByClient,
    getCreditHistoryByClient,
    createCredit,
    updateTotalCredit,
    deleteOneCredit
};