const Permission = require('../models/permissions.model');
const PermissionRole = require('../models/permissionsRoles.model');

const checkPermission = (nombrePermiso) => {
    return async (req, res, next) => {
        const userRoleId = req.user.idRol;

        if (!userRoleId) {
            return res.status(403).json({ message: 'No se ha encontrado el rol del usuario.' });
        }

        try {
            // Buscar el permiso por nombre
            const permission = await Permission.findOne({
                where: { nombrePermiso }
            });

            if (!permission) {
                return res.status(404).json({ 
                    message: `El permiso ${nombrePermiso} no existe en el sistema.`
                });
            }

            // Verificar si el rol tiene el permiso
            const hasPermission = await PermissionRole.findOne({
                where: {
                    idRol: userRoleId,
                    idPermiso: permission.idPermiso
                }
            });

            if (!hasPermission) {
                return res.status(403).json({ 
                    message: 'No tienes permiso para realizar esta acción.',
                    requiredPermission: nombrePermiso
                });
            }

            next();
        } catch (error) {
            console.error('Error en checkPermission:', error);
            return res.status(500).json({ 
                message: 'Error al verificar permisos', 
                error: error.message 
            });
        }
    };
};

module.exports = checkPermission;