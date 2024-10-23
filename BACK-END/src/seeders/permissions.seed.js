const Permissions = require('../models/permissions.model');

const predefinedPermissions = [

  { nombrePermiso: 'Crear Rol' },
  { nombrePermiso: 'Eliminar Rol' },
  { nombrePermiso: 'Editar Rol' },

  { nombrePermiso: 'Crear Venta' },
  { nombrePermiso: 'Eliminar Venta' },
  { nombrePermiso: 'Editar Venta' },
  { nombrePermiso: 'Ver Detalle de Venta' },

  { nombrePermiso: 'Crear Proveedor' },
  { nombrePermiso: 'Eliminar Proveedor' },
  { nombrePermiso: 'Editar Proveedor' },

  { nombrePermiso: 'Crear Producto' },
  { nombrePermiso: 'Eliminar Producto' },
  { nombrePermiso: 'Editar Producto' },

  { nombrePermiso: 'Crear Crédito' },
  { nombrePermiso: 'Eliminar Crédito' },
  { nombrePermiso: 'Editar Crédito' },

  { nombrePermiso: 'Crear Usuario' },
  { nombrePermiso: 'Eliminar Usuario' },
  { nombrePermiso: 'Editar Usuario' },

  { nombrePermiso: 'Crear Cliente' },
  { nombrePermiso: 'Eliminar Cliente' },
  { nombrePermiso: 'Editar Cliente' },

  { nombrePermiso: 'Crear Categoria' },
  { nombrePermiso: 'Eliminar Categoria' },
  { nombrePermiso: 'Editar Categoria' },

  { nombrePermiso: 'Crear Compra' },
  { nombrePermiso: 'Eliminar Compra' },
  { nombrePermiso: 'Editar Compra' },

  { nombrePermiso: 'Crear Devolución' },
  { nombrePermiso: 'Eliminar Devolución' },
  { nombrePermiso: 'Editar Devolución' }
  
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
