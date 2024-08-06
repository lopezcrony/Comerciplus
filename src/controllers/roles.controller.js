const { req, res } = require('express')
const rolService = require('../services/Roles.service');


const getAllRoles = async (req, res) => {
    try {
        const providers = await rolService.getAllRoles();
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los roles', error: error.message });
    }
};

const getOneRole= async (req, res) => {
    try {
        const provider = await rolService.getOneRol(req.params.id);
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el rol', error: error.message });
    }
}; 

const createNewRole= async (req, res) => {
    try {
        const newProvider = await rolService.createNewRol(req.body);
        res.status(201).json({ message: 'Rolecreado exitosamente.', newProvider });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear el rol.', error: error.message });
    }
};

const updateRole= async (req, res) => {
    try {
        const updatedProvider = await rolService.updateRol(req.params.id, req.body);
        res.status(200).json({ message: 'Roleactualizado exitosamente', updatedProvider});
    } catch (error) {
        if (error.message === 'El nombre del rol ya está registrado.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error al actualizar el rol', error: error.message });
        }
    }
};

const deleteOneRole= async (req, res) => {
    try {
        await rolService.deleteOneRol(req.params.id);
        res.json({ message: 'Rol eliminado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el rol', error: error.message });
    }
}

module.exports = {
    getAllRoles,
    getOneRole,
    createNewRole,
    updateRole,
    deleteOneRole
}
