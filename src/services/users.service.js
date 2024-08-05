const userRepository = require('../repositories/users.repository');

const getAllUsers = async () => {
    try {
        return await userRepository.getAllUsers();
    } catch (error) {
        throw new Error('Error al obtener todos los usuarios: ' + error.message);
    }
};

const getOneUser = async (id) => {
    try {
        const user = await userRepository.getOneUser(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    } catch (error) {
        throw new Error('Error al obtener el usuario: ' + error.message);
    }
};

const createNewUser = async (userData) => {
    try {
        return await userRepository.createNewUser(userData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe un usuario con esa información.');
        }
        throw new Error('Error al crear el usuario: ' + error.message);
    }
};

const updateOneUser = async (id, userData) => {
    try {
        const result = await userRepository.updateOneUser(id, userData);
        if (result[0] === 0) {
            throw new Error('Usuario no encontrado o no actualizado');
        }
        return result;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El correo del usuario ya está registrado.');
        }
        throw new Error('Error al actualizar el usuario: ' + error.message);
    }
};

const deleteOneUser = async (id) => {
    try {
        const result = await userRepository.deleteOneUser(id);
        if (result === 0) {
            throw new Error('Usuario no encontrado');
        }
        return result;
    } catch (error) {
        throw new Error('Error al eliminar el usuario: ' + error.message);
    }
};

module.exports = {
    getAllUsers,
    getOneUser,
    createNewUser,
    updateOneUser,
    deleteOneUser
};
