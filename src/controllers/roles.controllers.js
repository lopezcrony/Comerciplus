const { request, response } = require('express')
const { getAllRoles, getOneRoles, createNewRol,updateOneRol, deleteOneRol } = require('../services/Roles.service');


const GetAllRoles = async (request, response) => {
    try {
        const roles = await getAllRoles();
        response.json(roles);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener los roles', error: error.message });
    }
};

const GetOneRoles = async (request, response) => {
    try {
        // Destructuración para obtener el id de request.params
        const { id } = request.params
        const roles = await getOneRoles(id);

        if (roles) {
            response.json(roles);
        } else {
            response.status(404).json({ message: 'Rol no encontrado' })
        }
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el rol', error: error.message });
    }
};

const CreateNewRol = async (request, response) => {
    try {
        const { nombreRol } = request.body;

        const newRol = {
            nombreRol,
            
        };

        const result = await createNewRol(newRol);
        response.status(201).json({ message: 'Rol creado exitosamente.' });

    } catch (error) {
        response.status(500).json({ message: 'Error al crear el rol.', error: error.message });
    }
};

const UpdateRol = async (request, response) => {
    try {
        const { id } = request.params;
        const { nombreRol } = request.body;

        const roles = await getOneRoles(id);
        if(!roles){
            return response.status(404).json({ message: 'Rol no encontrado' });
        }

        const updatedRol = {
            nombreRol
        };

        const result = await updateOneRol(updatedRol);

        response.status(200).json({ message: 'Rol actualizado exitosamente'});

    } catch (error) {
        response.status(500).json({ message: 'Error al actualizar el rol.', error: error.message });
    }
};

const DeleteOneRol = async (request, response) => {
    try {
        const { id } = request.params
        const result = await deleteOneRol(id);

        if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Rol no encontrado.' });
        }
        response.status(200).json({ message: 'Rol eliminado con éxito.' });
        
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el rol', error: error.message });
    }
}

module.exports = {
    GetAllRoles,
    GetOneRoles,
    CreateNewRol,
    UpdateRol,
    DeleteOneRol
}

