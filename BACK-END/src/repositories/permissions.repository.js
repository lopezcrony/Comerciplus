const Permission = require('../models/permissions.model');
const PermissionRole = require('../models/permissionsRoles.model');

findAllPermissions = async () => {
    return await Permission.findAll();
}

// findPermissionById = async (id) => {
//     return await PermissionRole.findAll({
//         where: { idRol: id }
//     });
// };

findPermissionById = async (id) => {
    return await PermissionRole.findAll({
        where: { idRol: id },
        include: [{
            model: Permission,
            required: true,
            attributes: ['nombrePermiso']
        }]
    });
};

module.exports = {
    findAllPermissions,
    findPermissionById
};