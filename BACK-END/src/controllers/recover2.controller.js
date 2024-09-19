const User = require("../models/users.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
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

exports.resetPassword = async (req, res) => {
    try {
        const { correoUsuario } = req.body;
        const user = await User.findOne({ where: { correoUsuario } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { token, expirationTime } = generateResetToken();

        // Guardar el token y la fecha de expiración en la clave temporalmente
        const resetToken = `reset_${token}_${expirationTime}`;
        user.resetToken = token; // Usa el campo resetToken en lugar de claveUsuario
        user.resetTokenExpiration = expirationTime; // Usa el campo resetTokenExpiration
        await user.save();

        console.log('Token generado:', resetToken);
        console.log('Usuario actualizado:', user.toJSON());

        const resetUrl = `http://localhost:4200/restore`; // Frontend manejará el token desde el header
        const mailOptions = {
            to: user.correoUsuario,
            from: process.env.EMAIL_USER,
            subject: 'Restablecimiento de contraseña',
            text: `Has solicitado restablecer tu contraseña. Por favor, accede al siguiente enlace y usa el token de recuperación para completar el proceso:\n\n${resetUrl}\n\nEste enlace es válido por 1 hora.\n\nSi no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.`,
            headers: {
                'x-reset-token': token
            }
        };

        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');

        res.status(200).json({ message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.', token });
    } catch (error) {
        console.error('Error detallado:', error); // Asegúrate de que esta línea esté presente para imprimir el error detallado
        res.status(500).json({ message: 'Error al procesar la solicitud de restablecimiento de contraseña' });
    }
};
