const userRepository = require('../repositories/users.repository');

const resetPasswordWithToken = async (token, newPassword) => {
    try {
        const user = await userRepository.findUserByResetToken(token);
        
        if (!user) {
            throw new Error("El token de restablecimiento de contraseña es inválido o ha expirado");
        }

        const updatedUser = await userRepository.updateUserPassword(user, newPassword);
        console.log("Contraseña guardada en DB:", updatedUser.claveUsuario);

        return { message: "Tu contraseña ha sido actualizada exitosamente" };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    resetPasswordWithToken,
};