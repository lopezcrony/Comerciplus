const Permissions = require('../models/permissions.model');

const predefinedPermissions = [
  { nombrePermiso: 'Dashboard' },
  { nombrePermiso: 'Roles' },
  { nombrePermiso: 'Ventas' },
  { nombrePermiso: 'Proveedores' },
  { nombrePermiso: 'Productos' },
  { nombrePermiso: 'Créditos' },
  { nombrePermiso: 'Usuarios' },
  { nombrePermiso: 'Clientes' },
  { nombrePermiso: 'Categorias' },
  { nombrePermiso: 'Compras' },
  { nombrePermiso: 'Devoluciones' }
];

const seedPermissions = async () => {
  try {
    for (const permiso of predefinedPermissions) {
      await Permissions.findOrCreate({ where: { nombrePermiso: permiso.nombrePermiso } });
    }
    console.log('Permisos predefinidos cargados.');
  } catch (error) {
    console.error('Error al cargar los permisos predefinidos:', error);
  }
};

module.exports = seedPermissions;
