const providerRepository = require('../repositories/providers.repository');

const getAllProviders = async () => {
    try {
        return await providerRepository.findAllProviders();
    } catch (error) {
        throw error;
    }
};

const getOneProvider = async (id) => {
    try {
        return await providerRepository.findProviderById(id);
    } catch (error) {
        throw error;
    }
};

const createNewProvider = async (providerData) => {
    try {
        return await providerRepository.createProvider(providerData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe un proveedor con esa información.');
        }
        throw error;
    }
};

const updateOneProvider = async (id, providerData) => {
    try {
        const provider = await providerRepository.findProviderById(id);
        if (provider) {
            return await providerRepository.updateProvider(id, providerData);
        }
        throw new Error('Proveedor no encontrado');
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El NIT del proveedor ya está registrado.');
        }
        throw error;
    }
};

const deleteOneProvider = async (id) => {
    try {
        const result = await providerRepository.deleteProvider(id);
        if (result === 0) {
            throw new Error('Proveedor no encontrado');
        }
        return result;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getAllProviders,
    getOneProvider,
    createNewProvider,
    updateOneProvider,
    deleteOneProvider,
};
