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

const createProvider = async (providerData) => {
    try {
        return await providerRepository.createProvider(providerData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe un proveedor con esa información.');
        }
        throw error;
    }
};

const updateProvider = async (id, providerData) => {
    try {
        return await providerRepository.updateProvider(id, providerData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El NIT del proveedor ya está registrado.');
        }
        throw error;
    }
};

const updateProviderStatus = async (id, status) => {
    try {
        const result = await providerRepository.updateProviderStatus(id, status);
        if (!result) {
            throw new Error('SERVICE: El proveedor no se pudo actualizar');
        }
        return result;
    } catch (error) {
        throw new Error('Error al cambiar el estado del proveedor: ' + error.message);
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
    createProvider,
    updateProvider,
    updateProviderStatus,
    deleteOneProvider,
};
