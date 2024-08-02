const Provider = require('../models/providers.model');

const findAllProviders = async () => {
    return await Provider.findAll();
};

const findProviderById = async (id) => {
    return await Provider.findByPk(id);
};

const createProvider = async (providerData) => {
    return await Provider.create(providerData);
};

const updateProvider = async (id, providerData) => {
    const provider = await findProviderById(id);
    if (provider) {
        return await provider.update(providerData);
    }
    throw new Error('Proveedor no encontrado');
};

const deleteProvider = async (id) => {
    const result = await Provider.destroy({
        where: { idProveedor: id }
    });
    return result;
};


module.exports = {
    findAllProviders,
    findProviderById,
    createProvider,
    updateProvider,
    deleteProvider,
};
