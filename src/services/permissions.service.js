const permissionRepository = require('../repositories/permissions.repository');

const getAllPermissions = async () => {
    try {
        return await permissionRepository.findAllPermissions();
    } catch (error) {
        throw error;
    }
};

const getOnePermission = async (id) => {
    try {
        return await permissionRepository.findPermissionById(id);
    } catch (error) {
        throw error;
    }
};

const createNewPermission = async (permissionData) => {
    try {
        return await permissionRepository.createPermission(permissionData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe un permiso con esa información.');
        }
        throw error;
    }
};

const updateOnePermission = async (permissionData) => {
    try {
        return await permissionRepository.updatePermission(permissionData.idPermiso, permissionData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El nombre del permiso ya está registrado.');
        }
        throw error;
    }
};

const deleteOnePermission = async (id) => {
    try {
        const result = await permissionRepository.deletePermission(id);
        if (result === 0) {
            throw new Error('Permiso no encontrado');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllPermissions,
    getOnePermission,
    createNewPermission,
    updateOnePermission,
    deleteOnePermission,
};
