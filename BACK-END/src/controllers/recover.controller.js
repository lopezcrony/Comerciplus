const recoverService = require('../services/recover.service');

exports.resetPassword = async (req, res) => {
    try {
        const { correoUsuario } = req.body;
        const result = await recoverService.initiatePasswordReset(correoUsuario);
        
        res.status(200).json({ 
            message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.', 
            token: result.token 
        });
    } catch (error) {
        console.error('Error detallado:', error);
        if (error.message === 'Usuario no encontrado') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error al procesar la solicitud de restablecimiento de contraseña' });
        }
    }
};