const Permissions = require('../models/permissions.model');

const predefinedPermissions = [

  { nombrePermiso: 'Crear Rol' },
  { nombrePermiso: 'Eliminar Rol' },
  { nombrePermiso: 'Editar Rol' },

  { nombrePermiso: 'Crear Usuario' },
  { nombrePermiso: 'Editar Usuario' },
  { nombrePermiso: 'Cambiar Estado Usuario' },
  { nombrePermiso: 'Eliminar Usuario' },

  { nombrePermiso: 'Crear Compra' },
  { nombrePermiso: 'Anular Compra' },
  { nombrePermiso: 'Descargar Informe Compra' },

  { nombrePermiso: 'Crear Proveedor' },
  { nombrePermiso: 'Editar Proveedor' },	
  { nombrePermiso: 'Cambiar Estado Proveedor' },	
  
  { nombrePermiso: 'Crear Producto' },
  { nombrePermiso: 'Eliminar Producto' },
  { nombrePermiso: 'Editar Producto' },	
  { nombrePermiso: 'Cambiar Estado Producto' },	
  { nombrePermiso: 'Descargar Informe Producto' },

  { nombrePermiso: 'Crear Categoría' },
  { nombrePermiso: 'Eliminar Categoría' },
  { nombrePermiso: 'Editar Categoría' },
  { nombrePermiso: 'Cambiar Estado Categoría' },

  { nombrePermiso: 'Crear Venta' },
  { nombrePermiso: 'Anular Venta' },	

  { nombrePermiso: 'Crear Cliente' },
  { nombrePermiso: 'Editar Cliente' },
  { nombrePermiso: 'Cambiar Estado Cliente' },
  { nombrePermiso: 'Descargar Informe Cliente' },

  { nombrePermiso: 'Crear Crédito' },
  { nombrePermiso: 'Crear Abono' },
  { nombrePermiso: 'Anular Abono' },	

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
