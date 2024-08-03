const providerService = require('../services/providers.service');

const getAllProviders = async (req, res) => {
    try {
        const providers = await providerService.getAllProviders();
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los proveedores', error: error.message });
    }
};

const getOneProvider = async (req, res) => {
    try {
        const provider = await providerService.getOneProvider(req.params.id);
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el proveedor', error: error.message });
    }
};

const createProvider = async (req, res) => {
    try {
        const newProvider = await providerService.createProvider(req.body);
        res.status(201).json({ message: 'Proveedor creado exitosamente.', newProvider });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear el proveedor.', error: error.message });
    }
};

const updateProvider = async (req, res) => {
    try {
        const updatedProvider = await providerService.updateProvider(req.params.id, req.body);
        res.status(200).json({ message: 'Proveedor actualizado exitosamente', updatedProvider});
    } catch (error) {
        if (error.message === 'El NIT del proveedor ya está registrado.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error al actualizar el proveedor', error: error.message });
        }
    }
};

const deleteOneProvider = async (req, res) => {
    try {
        await providerService.deleteOneProvider(req.params.id);
        res.json({ message: 'Proveedor eliminado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el proveedor', error: error.message });
    }
};

module.exports = {
    getAllProviders,
    getOneProvider,
    createProvider,
    updateProvider,
    deleteOneProvider
};
