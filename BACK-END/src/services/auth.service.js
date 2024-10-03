const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRepository = require('../repositories/users.repository');

const SECRET_KEY = process.env.SECRET_KEY;

const loginUser = async (correoUsuario, claveUsuario) => {
  const user = await userRepository.findUserByEmail(correoUsuario);
  
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (!user.estadoUsuario) {
    throw new Error("Cuenta desactivada. Contacte al administrador.");
  }

  const freshUser = await userRepository.findUserById(user.idUsuario);
  
  const isPasswordValid = await bcrypt.compare(claveUsuario, freshUser.claveUsuario);

  if (!isPasswordValid) {
    throw new Error("Contraseña incorrecta");
  }

  const token = jwt.sign(
    {
      idUsuario: user.idUsuario,
      idRol: user.idRol,
      correoUsuario: user.correoUsuario,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  return {
    success: true,
    message: "Inicio de sesión exitoso",
    token,
    user: {
      idUsuario: user.idUsuario,
      nombreUsuario: user.nombreUsuario,
      correoUsuario: user.correoUsuario,
      idRol: user.idRol,
    },
  };
};

module.exports = {
  loginUser,
};