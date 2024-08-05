const Roles = require('../models/roles.model');

const findAllRoles = async () => {
    return await Roles.findAll();
};

const findRoleById = async (id) => {
    return await Roles.findByPk(id);
};

const createRole = async (roleData) => {
    return await Roles.create(roleData);
};

const updateRole = async (id, roleData) => {
    const role = await findRoleById(id);
    if (role) {
        return await role.update(roleData);
    }
    throw new Error('Rol no encontrado');
};

const deleteRole = async (id) => {
    const result = await Roles.destroy({
        where: { idRol: id }
    });
    return result;
};

module.exports = {
    findAllRoles,
    findRoleById,
    createRole,
    updateRole,
    deleteRole,
};
