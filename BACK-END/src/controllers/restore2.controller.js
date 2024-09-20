const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.resetPasswordWithToken = async (req, res) => {
    try {
        const token = req.headers["x-reset-token"]; // Token recibido desde los headers
        const { claveUsuario } = req.body; // Nueva contraseña recibida desde el body

        if (!token) {
            return res.status(400).json({
                message: "El token de restablecimiento de contraseña es requerido",
            });
        }

        // Buscar el usuario con el token específico
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: {
                    [Op.gt]: Date.now(),
                },
            },
        });

        if (!user) {
            return res.status(400).json({
                message:
                    "El token de restablecimiento de contraseña es inválido o ha expirado",
            });
        }

        user.claveUsuario = claveUsuario; // No hagas el hash aquí
        user.resetToken = null;
        user.resetTokenExpiration = null;

        await user.save();

        // Verifica inmediatamente después de guardar
        const updatedUser = await User.findByPk(user.idUsuario);
        console.log("Contraseña guardada en DB:", updatedUser.claveUsuario);

        res
            .status(200)
            .json({ message: "Tu contraseña ha sido actualizada exitosamente" });
    } catch (error) {
        console.error("Error detallado al actualizar la contraseña:", error);
        res.status(500).json({
            message: "Error al actualizar la contraseña",
            error: error.message,
        });
    }
};
