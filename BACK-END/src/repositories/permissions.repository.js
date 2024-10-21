const Permission = require('../models/permissions.model');
const PermissionRole = require('../models/permissionsRoles.model');

findAllPermissions = async () => {
    return await Permission.findAll();
}

findPermissionById = async (id) => {
    return await PermissionRole.findAll({
        where: { idRol: id }
    });
};

module.exports = {
    findAllPermissions,
    findPermissionById
};