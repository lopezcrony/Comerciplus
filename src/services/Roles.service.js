const connection = require('../config/db');
const roleRepository = require('../repositories/roles.repository')

const getAllRoles = async () => {
    try {
        return await roleRepository.findAllRoles();
    } catch (error) {
        throw error;
    }
};

const getOneRol = async (id) => {
    try {
        return await roleRepository.findRoleById(id);
    } catch (error) {
        throw error;
    }
};

const createNewRol = async (rolData) => {
    try {
        return await roleRepository.createRole(rolData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe rol con ese nombre.');
        }
        throw error;
    }
};

const updateRol = async (id, rolData) => {
    try {
        return await roleRepository.updateRole(id, rolData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe ese rol.');
        }
        throw error;
    }
};

const deleteOneRol = async (id) => {
    try {
        const result = await roleRepository.deleteRole(id);
        if (result === 0) {
            throw new Error('Rol no encontrado');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllRoles,
    getOneRol,
    createNewRol,
    updateRol,
    deleteOneRol
}
