const Role = require('../models/roles.model');
const User = require('../models/users.model');
const Permissions = require('../models/permissions.model');
const PermissionsRole = require('../models/permissionsRoles.model');

const { } = require('./permissions.seed');

const sendRoleAndUser = async () => {
    try {

        // Verificaciones iniciales
        const [existingUser, existingRole] = await Promise.all([
            User.findOne({ where: { cedulaUsuario: '0000000000' } }),
            Role.findOne({ where: { nombreRol: 'Administrador' } })
        ]);

        // Si ya existe todo no hacemos nada
        if (existingUser && existingRole) return;
        

        // De lo contrario, creamos un rol
        const [role] = await Role.findOrCreate({ where: { nombreRol: 'Administrador' } });

        // Asignamos todos los permisos al rol
        const permissions = await Permissions.findAll();
        for (const p of permissions) {
            await PermissionsRole.findOrCreate({ where: { idRol: role.idRol, idPermiso: p.idPermiso } });
        }

        // Creamos un usuario
        const user = await User.findOrCreate({
            where: {
                idRol: role.idRol,
                cedulaUsuario: '0000000000',
                nombreUsuario: 'ComerciPlus',
                apellidoUsuario: ' ',
                telefonoUsuario: '0000000000',
                correoUsuario: 'comerciplus@gmail.com',
                claveUsuario: 'Comerciplus2024',
            }
        });

    } catch (error) {
        console.error('Error al cargar el rol y usuario predefinidos:', error);
    }
}

module.exports = sendRoleAndUser;