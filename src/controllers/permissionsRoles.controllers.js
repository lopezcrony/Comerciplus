const permissionsRolesService = require('../services/permissionsRoles.service');

const getAllPermissionsRoles = async (req, res) => {
    try {
        const permissionsRoles = await permissionsRolesService.getAllPermissionsRoles();
        res.status(200).json(permissionsRoles);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los permisosRoles', error: error.message });
    }
};

const getOnePermissionRole = async (req, res) => {
    try {
        const permissionRole = await permissionsRolesService.getOnePermissionRole(req.params.id);
        res.status(200).json(permissionRole);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el permisoRol', error: error.message });
    }
};

const createPermissionRole = async (req, res) => {
    try {
        const newPermissionRole = await permissionsRolesService.createPermissionRole(req.body);
        res.status(201).json({ message: 'PermisoRol creado exitosamente.', newPermissionRole });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear el permisoRol.', error: error.message });
    }
};

const updatePermissionRole = async (req, res) => {
    try {
        const updatedPermissionRole = await permissionsRolesService.updatePermissionRole(req.params.id, req.body);
        res.status(200).json({ message: 'PermisoRol actualizado exitosamente', updatedPermissionRole });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el permisoRol', error: error.message });
    }
};

const deleteOnePermissionRole = async (req, res) => {
    try {
        await permissionsRolesService.deleteOnePermissionRole(req.params.id);
        res.json({ message: 'PermisoRol eliminado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el permisoRol', error: error.message });
    }
};

module.exports = {
    getAllPermissionsRoles,
    getOnePermissionRole,
    createPermissionRole,
    updatePermissionRole,
    deleteOnePermissionRole
};
