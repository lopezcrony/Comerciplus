require("dotenv").config();
const { connectToDatabase, sequelize } = require('./src/config/db');
const Server = require('./src');
const seedPermissions = require('./src/seeders/permissions.seed');
const { Roles, Permissions } = require('./src/models/associationpermissions'); // Asegúrate de que esta ruta sea correcta

const server = new Server();

const startServer = async () => {
  try {
    await connectToDatabase();
    
    Roles.belongsToMany(Permissions, {
      through: 'PermissionRole',
      foreignKey: 'idRol',
      otherKey: 'idPermiso'
    });
    Permissions.belongsToMany(Roles, {
      through: 'PermissionRole',
      foreignKey: 'idPermiso',
      otherKey: 'idRol'
    });
    
    await sequelize.sync({ alter: true });
    await seedPermissions();
    server.listen();
  } catch (error) {
    console.error('No se pudo inicializar el servidor:', error);
  }
};

startServer();