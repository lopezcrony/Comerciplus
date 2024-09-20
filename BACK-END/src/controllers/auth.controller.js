const authService = require('../services/auth.service');

const loginUser = async (req, res) => {
  const { correoUsuario, claveUsuario } = req.body;

  try {
    const result = await authService.loginUser(correoUsuario, claveUsuario);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Cuenta desactivada. Contacte al administrador.") {
      res.status(403).json({ message: error.message });
    } else if (error.message === "Contraseña incorrecta") {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
  }
};

const logoutUser = (req, res) => {
  res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

module.exports = {
  loginUser,
  logoutUser,
};