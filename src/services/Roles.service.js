const connection = require('../config/db');
const roleRepository = require('../repositories/roles.repository')

const getAllRoles = async () => {
    try {
        return await roleRepository.findAllRoles();
    } catch (error) {
        throw error;
    }
};

const getOneRole= async (id) => {
    try {
        return await roleRepository.findRoleById(id);
    } catch (error) {
        throw error;
    }
};

const createNewRole = async (rolData) => {
    try {
        return await roleRepository.createRole(rolData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe rol con ese nombre.');
        }
        throw error;
    }
};

const updateRole= async (id, rolData) => {
    try {
        return await roleRepository.updateRole(id, rolData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe ese rol.');
        }
        throw error;
    }
};

const updateRoleStatus = async (id, status) => {
    try {
        const result = await roleRepository.updateRoleStatus(id, status);
        if (!result) {
            throw new Error('SERVICE: El rol no se pudo actualizar');
        }
        return result;
    } catch (error) {
        throw new Error('Error al cambiar el estado del rol: ' + error.message);
    }
};

const deleteOneRole= async (id) => {
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
    getOneRole,
    createNewRole,
    updateRole,
    updateRoleStatus,
    deleteOneRole
}
