const returnProviderRepository = require('../repositories/returnProvider.repository');

const getAllReturnProvider = async () => {
    try {
        return await returnProviderRepository.findAllReturnProvider();
    } catch (error) {
        throw error;
    }
};

const getOneReturnProvider = async (id) => {
    try {
        return await returnProviderRepository.findReturnProviderById(id);
    } catch (error) {
        throw error;
    }
};

const createReturnProvider = async (returnProviderData) => {
    try {
        return await returnProviderRepository.createReturnProvider(returnProviderData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe el registro de una pérdida con esa información.');
        }
        throw error;
    }
};


const updateReturnProvider = async (id, status) => {
    try {
        const result = await returnProviderRepository.updateReturnProviderStatus(id, status);
        if (!result) {
            throw new Error('SERVICE: El estado de la perdida no se pudo actualizar');
        }
        return result;
    } catch (error) {
        throw new Error('Error al cambiar el estado de la venta: ' + error.message);
    }
};


module.exports = {
    getAllReturnProvider,
    getOneReturnProvider,
    createReturnProvider,    
    updateReturnProvider,
};
