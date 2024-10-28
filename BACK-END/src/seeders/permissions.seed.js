const Permissions = require('../models/permissions.model');

const predefinedPermissions = [

  { nombrePermiso: 'Crear Rol' },
  { nombrePermiso: 'Eliminar Rol' },
  { nombrePermiso: 'Editar Rol' },

  { nombrePermiso: 'Crear Usuario' },
  { nombrePermiso: 'Editar Usuario' },
  { nombrePermiso: 'Eliminar Usuario' },

  { nombrePermiso: 'Crear Venta' },
  { nombrePermiso: 'Anular Venta' },	

  { nombrePermiso: 'Crear Proveedor' },
  { nombrePermiso: 'Editar Proveedor' },	

  { nombrePermiso: 'Crear Producto' },
  { nombrePermiso: 'Eliminar Producto' },
  { nombrePermiso: 'Editar Producto' },	
  { nombrePermiso: 'Descargar Informe Producto' },

  { nombrePermiso: 'Crear Crédito' },
  { nombrePermiso: 'Editar Crédito' },
  { nombrePermiso: 'Anular Abono' },	

  { nombrePermiso: 'Crear Cliente' },
  { nombrePermiso: 'Editar Cliente' },
  { nombrePermiso: 'Descargar Informe Cliente' },

  { nombrePermiso: 'Crear Categoría' },
  { nombrePermiso: 'Eliminar Categoría' },
  { nombrePermiso: 'Editar Categoría' },

  { nombrePermiso: 'Crear Compra' },
  { nombrePermiso: 'Anular Compra' },
  { nombrePermiso: 'Descargar Informe Compra' },		

  { nombrePermiso: 'Crear Devolución' },
  { nombrePermiso: 'Anular Devolución' },
  { nombrePermiso: 'Cambiar Estado Devolución' }
  
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
