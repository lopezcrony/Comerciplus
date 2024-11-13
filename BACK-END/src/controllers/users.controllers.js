const userService = require('../services/users.service');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

const getOneUser = async (req, res) => {
    try {
        const user = await userService.getOneUser(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};

const createNewUser = async (req, res) => {
    try {
        const newUser = await userService.createNewUser(req.body);
        res.status(201).json({ message: 'Usuario creado exitosamente.', newUser });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario.', error: error.message });
    }
};

const updateOneUser = async (req, res) => {
    try {
        const { claveUsuario, ...userData } = req.body;
        
        const updatedUser = await userService.updateOneUser(req.params.id, userData);
        res.status(200).json({ message: 'Usuario actualizado exitosamente', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
};

//Patch para el cambio de estado

const updateUserStatus  = async (req, res) => {
    try {
        let { estadoUsuario } = req.body;

        if (estadoUsuario === '0' || estadoUsuario === 0) {
            estadoUsuario = false;
        } else if (estadoUsuario === '1' || estadoUsuario === 1) {
            estadoUsuario = true;
        } else if (estadoUsuario === true || estadoUsuario === false) {
            
        } else {
            return res.status(400).json({ message: 'El estado debe ser un valor booleano' });
        }
        
        await userService.updateUserStatus (req.params.id, estadoUsuario);
        res.json({ message: 'Estado actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del usuario', error: error.message });
    }
};


const deleteOneUser = async (req, res) => {
    try {
        await userService.deleteOneUser(req.params.id);
        res.json({ message: 'Usuario eliminado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getOneUser,
    createNewUser,
    updateOneUser,
    updateUserStatus,
    deleteOneUser
};
