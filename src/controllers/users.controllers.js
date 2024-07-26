const { request, response } = require('express')
const { getAllUsers, getOneUsers, createNewUser,updateOneUser, deleteOneUser } = require('../services/users.service');


const GetAllUsers = async (request, response) => {
    try {
        const users = await getAllUsers();
        response.json(users);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

const GetOneUsers = async (request, response) => {
    try {
        // Destructuración para obtener el id de request.params
        const { id } = request.params
        const users = await getOneUsers(id);

        if (users) {
            response.json(users);
        } else {
            response.status(404).json({ message: 'Usario no encontrado' })
        }
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
}; 

const CreateNewUser = async (request, response) => {
    try {
        const { cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contraseñaUsuario } = request.body;

        const newUser = {
            cedulaUsuario,
            nombreUsuario,
            apellidoUsuario,
            telefonoUsuario,
            correoUsuario,
            contraseñaUsuario
            
        };

        const result = await createNewUser(newUser);
        response.status(201).json({ message: 'Usuario creado exitosamente.' });

    } catch (error) {
        response.status(500).json({ message: 'Error al crear el usuario.', error: error.message });
    }
};

const UpdateUser = async (request, response) => {
    try {
        const { id } = request.params;
        const { cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contraseñaUsuario } = request.body;

        const users = await getOneUsers(id);
        if(!users){
            return response.status(404).json({ message: 'Usuario no encontrado' });
        }

        const updatedUser = {
            idUsuario:id,
            cedulaUsuario,
            nombreUsuario,
            apellidoUsuario,
            telefonoUsuario,
            correoUsuario,
            contraseñaUsuario
        };

        const result = await updateOneUser(updatedUser);

        response.status(200).json({ message: 'Usuario actualizado exitosamente'});

    } catch (error) {
        response.status(500).json({ message: 'Error al actualizar el usuario.', error: error.message });
    }
};

const DeleteOneUser = async (request, response) => {
    try {
        const { id } = request.params
        const result = await deleteOneUser(id);

        if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Usuario no encontrado.' });
        }
        response.status(200).json({ message: 'Usuario eliminado con éxito.' });
        
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
}

module.exports = {
    GetAllUsers,
    GetOneUsers,
    CreateNewUser,
    UpdateUser,
    DeleteOneUser
}

