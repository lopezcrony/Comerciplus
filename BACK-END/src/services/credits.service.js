const creditRepository = require('../repositories/credits.repository');

const getAllCredits = async () => {
    try {
        return await creditRepository.findAllCredits();
    } catch (error) {
        throw error;
    }
};

const getOneCredit = async (id) => {
    try {
        return await creditRepository.findCreditById(id);
    } catch (error) {
        throw error;
    }
};

const createCredit = async (creditData) => {
    try {
        return await creditRepository.createCredit(creditData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe un crédito asociado a este cliente.');
        }
        throw error;
    }
};

const updateTotalCredit = async (id, newTotalCredit) => {
    try {
        const result = await creditRepository.updateTotalCredit(id, newTotalCredit);
        if(!result){
            throw new Error('El valor total del crédito no pudo ser actualizado.'); 
        };
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteOneCredit = async (id) => {
    try {
        const result = await creditRepository.deleteOneCredit(id);
        if (result === 0) {
            throw new Error('SERVICE: Crédito no encontrado');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllCredits,
    getOneCredit,
    createCredit,
    updateTotalCredit,
    deleteOneCredit
};