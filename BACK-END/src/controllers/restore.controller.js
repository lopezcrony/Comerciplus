const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

exports.resetPasswordWithToken = async (req, res) => {
    try {
        const token = req.headers['x-reset-token']; // Token recibido desde los headers
        const { claveUsuario } = req.body; // Nueva contraseña recibida desde el body
        
        if (!token) {
            return res.status(400).json({ message: 'El token de restablecimiento de contraseña es requerido' });
        }

        console.log('Token recibido:', token);

        // Buscar el usuario con el token específico
        const user = await User.findOne({
            where: {
                claveUsuario: { [Op.like]: `reset_${token}%` }
            }
        });

        console.log('Usuario encontrado:', user ? 'Sí' : 'No');
        if (!user) {
            return res.status(400).json({ message: 'El token de restablecimiento de contraseña es inválido o ha expirado' });
        }

        // Extraer la fecha de expiración del token
        const [, , expirationTime] = user.claveUsuario.split('_');
        console.log('Tiempo de expiración:', new Date(parseInt(expirationTime)).toLocaleString());
        console.log('Tiempo actual:', new Date().toLocaleString());

        // Verificar si el token ha expirado
        if (Date.now() > parseInt(expirationTime)) {
            return res.status(400).json({ message: 'El token de restablecimiento de contraseña ha expirado' });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(claveUsuario, 10);
        console.log('Nueva contraseña encriptada:', hashedPassword);

        // Actualizar la contraseña y eliminar el token
        user.claveUsuario = hashedPassword; // Se actualiza con la nueva contraseña
        await user.save();

        console.log('Contraseña actualizada exitosamente en la base de datos.');

        res.status(200).json({ message: 'Tu contraseña ha sido actualizada exitosamente' });
    } catch (error) {
        console.error('Error detallado al actualizar la contraseña:', error);
        res.status(500).json({ message: 'Error al actualizar la contraseña', error: error.message });
    }
};
