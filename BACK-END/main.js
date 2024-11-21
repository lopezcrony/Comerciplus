require("dotenv").config();
const { connectToDatabase, sequelize } = require('./src/config/db');
const Server = require('./src/index');
const seedPermissions = require('./src/seeders/permissions.seed');
const seedRoleAndUser = require('./src/seeders/defaultRoleAndUser');

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    
    // Cargar los permisos predefinidos
    await seedPermissions();
    
    // Cargar el rol y usuario predefinidos
    await seedRoleAndUser();

    // Crear e iniciar el servidor
    const server = new Server();
    await server.start();

    return server.app; // Export the app for testing
  } catch (error) {
    console.error('No se pudo inicializar el servidor:', error);
    process.exit(1);
  }
};

module.exports = startServer(); // Export the promise that resolves to the app