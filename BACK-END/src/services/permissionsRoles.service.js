const permissionsRolesRepository = require('../repositories/permissionsRoles.repository');

const getAllPermissionsRoles = async () => {
    try {
        return await permissionsRolesRepository.findAllPermissionsRoles();
    } catch (error) {
        throw error;
    }
};

const getOnePermissionRole = async (id) => {
    try {
        return await permissionsRolesRepository.findPermissionRoleById(id);
    } catch (error) {
        throw error;
    }
};

const createPermissionRole = async (permissionRoleData) => {
    try {
        return await permissionsRolesRepository.createPermissionRole(permissionRoleData);
    } catch (error) {
        throw error;
    }
};

const updatePermissionRole = async (id, permissionRoleData) => {
    try {
        return await permissionsRolesRepository.updatePermissionRole(id, permissionRoleData);
    } catch (error) {
        throw error;
    }
};

const deleteOnePermissionRole = async (id) => {
    try {
        const result = await permissionsRolesRepository.deletePermissionRole(id);
        if (result === 0) {
            throw new Error('PermisoRol no encontrado');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllPermissionsRoles,
    getOnePermissionRole,
    createPermissionRole,
    updatePermissionRole,
    deleteOnePermissionRole,
};
