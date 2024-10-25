const PermissionService = require('../services/permission.service'); // Importa el servicio de permisos

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await PermissionService.getAllPermissions(); // Llama al servicio para obtener todos los permisos
    res.status(200).json(permissions); // Devuelve los permisos en formato JSON
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los permisos', error: error.message });
  }
};

const getPermissionsByRole = async (req, res) => {
  try {
    const { idRol } = req.params;
    const permissions = await PermissionService.getPermissionsByRole(idRol);
    if (!permissions) {
      return res.status(404).json({ message: 'Permisos no encontrados para el rol' });
    }
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los permisos', error: error.message });
  }
};

module.exports = {
  getAllPermissions,
  getPermissionsByRole
};
