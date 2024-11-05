require("dotenv").config();
const { connectToDatabase, sequelize } = require('./src/config/db');
const Server = require('./src');
const seedPermissions = require('./src/seeders/permissions.seed');
const seedRoleAndUser = require('./src/seeders/defaultRoleAndUser');

const server = new Server();

const startServer = async () => {
  try {
    await connectToDatabase();
    
    await sequelize.sync({ alter: true });
    
    // Carga los permisos predefinidos
    await seedPermissions();
    // Carga el rol y usuario predefinidos
    await seedRoleAndUser();

    server.listen();
  } catch (error) {
    console.error('No se pudo inicializar el servidor:', error);
  }
};

startServer();