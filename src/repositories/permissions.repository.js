const Permissions = require('../models/permissions.model');

const findAllPermissions = async () => {
    return await Permissions.findAll();
};

const findPermissionById = async (id) => {
    return await Permissions.findByPk(id);
};

const createPermission = async (permissionData) => {
    return await Permissions.create(permissionData);
};

const updatePermission = async (id, permissionData) => {
    const permission = await findPermissionById(id);
    if (permission) {
        return await permission.update(permissionData);
    }
    throw new Error('Permiso no encontrado');
};

const deletePermission = async (id) => {
    const result = await Permissions.destroy({
        where: { idPermiso: id }
    });
    return result;
};

module.exports = {
    findAllPermissions,
    findPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
};
