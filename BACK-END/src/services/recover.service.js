const crypto = require("crypto");
const nodemailer = require("nodemailer");
const userRepository = require('../repositories/users.repository');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const EXPIRATION_TIME = 3600000; // 1 hora en milisegundos

function generateResetToken() {
    const token = crypto.randomBytes(20).toString("hex");
    const expirationTime = Date.now() + EXPIRATION_TIME;
    return { token, expirationTime };
}

exports.initiatePasswordReset = async (correoUsuario) => {
    const user = await userRepository.findUserByEmail(correoUsuario);

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const { token, expirationTime } = generateResetToken();

    await userRepository.saveResetToken(user, token, expirationTime);

    // Modificado: incluir el token en la URL
    const resetUrl = `${process.env.webUrl}/restore?token=${token}`; 
    const mailOptions = {
        to: user.correoUsuario,
        from: process.env.EMAIL_USER,
        subject: 'Restablecimiento de contraseña',
        text: `Has solicitado restablecer tu contraseña. Por favor, accede al siguiente enlace y usa el token de recuperación para completar el proceso:\n\n${resetUrl}\n\nEste enlace es válido por 1 hora.\n\nSi no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.`,
        headers: {
            'x-reset-token': token // Este header ya no es necesario para el flujo actual
        }
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente');

    return { token };
};