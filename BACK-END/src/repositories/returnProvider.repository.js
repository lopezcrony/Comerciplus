const returnProvider = require('../models/returnProvider.model');

const findAllReturnProvider = async () => {
    return await returnProvider.findAll();
};

const findReturnProviderById = async (id) => {
    return await returnProvider.findByPk(id);
};

const createReturnProvider = async (ReturnProviderData) => {
    return await returnProvider.create(ReturnProviderData);
};

const updateReturnProviderStatus = async (id, status) => {

    const ReturnProvider = await findReturnProviderById(id);
    if (ReturnProvider) {
        return await ReturnProvider.update({estado : status});
    }
    throw new Error('Devolucion Local no encontrada');
};


module.exports = {
    findAllReturnProvider,
    findReturnProviderById,
    createReturnProvider,
    updateReturnProviderStatus
};
