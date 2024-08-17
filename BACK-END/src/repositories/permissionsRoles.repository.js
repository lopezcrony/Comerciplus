const PermissionRole = require('../models/permissionsRoles.model');

const findAllPermissionsRoles = async () => {
    return await PermissionRole.findAll();
};

const findPermissionRoleById = async (id) => {
    return await PermissionRole.findByPk(id);
};

const createPermissionRole = async (permissionRoleData) => {
    return await PermissionRole.create(permissionRoleData);
};

const updatePermissionRole = async (id, permissionRoleData) => {
    const permissionRole = await findPermissionRoleById(id);
    if (permissionRole) {
        return await permissionRole.update(permissionRoleData);
    }
    throw new Error('PermisoRol no encontrado');
};

const deletePermissionRole = async (id) => {
    const result = await PermissionRole.destroy({
        where: { idPermisosRol: id }
    });
    return result;
};

module.exports = {
    findAllPermissionsRoles,
    findPermissionRoleById,
    createPermissionRole,
    updatePermissionRole,
    deletePermissionRole,
};
