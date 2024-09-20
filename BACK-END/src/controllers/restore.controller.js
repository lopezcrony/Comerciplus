const restoreService = require('../services/restore.service');

const resetPasswordWithToken = async (req, res) => {
    try {
        const token = req.headers["x-reset-token"];
        const { claveUsuario } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "El token de restablecimiento de contraseña es requerido",
            });
        }

        const result = await restoreService.resetPasswordWithToken(token, claveUsuario);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "El token de restablecimiento de contraseña es inválido o ha expirado") {
            res.status(400).json({ message: error.message });
        } else {
            console.error("Error detallado al actualizar la contraseña:", error);
            res.status(500).json({
                message: "Error al actualizar la contraseña",
                error: error.message,
            });
        }
    }
};

module.exports = {
    resetPasswordWithToken,
};