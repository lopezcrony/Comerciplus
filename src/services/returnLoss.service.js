const ReturnLossRepository = require('../repositories/returnLoss.repository');

const getAllReturnLoss = async () => {
    try {
        return await ReturnLossRepository.findAllReturnLoss();
    } catch (error) {
        throw error;
    }
};

const getOneReturnLoss = async (id) => {
    try {
        return await ReturnLossRepository.findReturnLossById(id);
    } catch (error) {
        throw error;
    }
};

const createReturnLoss = async (ReturnLossData) => {
    try {
        return await ReturnLossRepository.createReturnLoss(ReturnLossData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe una perdida con el mismo ID.');
        }
        throw error;
    }
};

module.exports = {
    getAllReturnLoss,
    getOneReturnLoss,
    createReturnLoss,    
};
