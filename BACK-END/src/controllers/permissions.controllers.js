const { request, response } = require('express')
const permissionsSrvice = require('../services/permissions.service');


const GetAllPermissions = async (req, response) => {
    try {
        const permissions = await permissionsSrvice.getAllPermissions();
        response.json(permissions);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener los permisos', error: error.message });
    }
};

const GetOnePermissions = async (request, response) => {
    try {
        // Destructuración para obtener el id de request.params
        const { id } = request.params
        const permissions = await permissionsSrvice.getOnePermission(id);

        if (permissions) {
            response.json(permissions);
        } else {
            response.status(404).json({ message: 'Permiso no encontrado' })
        }
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el permiso', error: error.message });
    }
};

const CreateNewPermission = async (request, response) => {
    try {
        const { nombrePermiso } = request.body;

        const newPermiso = {
            nombrePermiso,

        };

        const result = await permissionsSrvice.createNewPermission(newPermiso);
        response.status(201).json({ message: 'Permiso creado exitosamente.' });

    } catch (error) {
        response.status(500).json({ message: 'Error al crear el permiso.', error: error.message });
    }
};

const UpdatePermission = async (req, res) => {
    try {
        const updatedPermision = await permissionsSrvice.updateOnePermission(req.params.id, req.body);
        res.status(200).json({ message: 'Permiso actualizado exitosamente', updatedPermision });
    } catch (error) {

        res.status(500).json({ message: 'Error al actualizar el permiso', error: error.message });

    }
};

const DeleteOnePermission = async (request, response) => {
    try {
        const { id } = request.params
        const result = await deleteOnePermission(id);

        if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Permiso no encontrado.' });
        }
        response.status(200).json({ message: 'Permiso eliminado con éxito.' });

    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el permiso', error: error.message });
    }
}

module.exports = {
    GetAllPermissions,
    GetOnePermissions,
    CreateNewPermission,
    UpdatePermission,
    DeleteOnePermission
}

