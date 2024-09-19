const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY;

// Controlador para el login
const loginUser = async (req, res) => {
    const { correoUsuario, claveUsuario } = req.body;

    try {
        // Buscar usuario por correo
        const user = await User.findOne({ where: { correoUsuario } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el usuario está activo
        if (!user.estadoUsuario) {
            return res.status(403).json({ message: 'Cuenta desactivada. Contacte al administrador.' });
        }

        console.log('Contraseña ingresada:', claveUsuario);
        console.log('Contraseña almacenada (hash):', user.claveUsuario);

        // Verificar si la contraseña es válida
        const isPasswordValid = await bcrypt.compare(claveUsuario, user.claveUsuario);
        console.log('¿Contraseña válida?:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign({ 
            idUsuario: user.idUsuario, 
            idRol: user.idRol, 
            correoUsuario: user.correoUsuario 
        }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                idUsuario: user.idUsuario,
                nombreUsuario: user.nombreUsuario,
                correoUsuario: user.correoUsuario,
                idRol: user.idRol
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};

// Controlador para el logout
const logoutUser = (req, res) => {
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};

module.exports = {
    loginUser,
    logoutUser
};
