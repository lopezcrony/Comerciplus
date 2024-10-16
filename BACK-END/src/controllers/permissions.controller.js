const PermissionService = require('../services/permission.service'); // Importa el servicio de permisos

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await PermissionService.getAllPermissions(); // Llama al servicio para obtener todos los permisos
    res.status(200).json(permissions); // Devuelve los permisos en formato JSON
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los permisos', error: error.message });
  }
};

module.exports = {
  getAllPermissions,
};
