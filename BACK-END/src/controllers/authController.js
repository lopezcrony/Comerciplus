const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY; // Asegúrate de tener esta clave en tu .env

// Controlador para el login
const loginUser = async (req, res) => {
    const { correoUsuario, claveUsuario } = req.body;

    try {
        // Busca el usuario por su correo
        const user = await User.findOne({ where: { correoUsuario } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verifica la contraseña
        const isPasswordValid = await bcrypt.compare(claveUsuario, user.claveUsuario);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Genera el token JWT
        const token = jwt.sign({ idUsuario: user.idUsuario, idRol: user.idRol }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
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

module.exports = {
    loginUser
};
