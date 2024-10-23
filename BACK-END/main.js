require("dotenv").config();
const { connectToDatabase, sequelize } = require('./src/config/db');
const Server = require('./src');
const seedPermissions = require('./src/seeders/permissions.seed');

const server = new Server();

const startServer = async () => {
  try {
    await connectToDatabase();
    
    await sequelize.sync({ alter: true });
    await seedPermissions();
    server.listen();
  } catch (error) {
    console.error('No se pudo inicializar el servidor:', error);
  }
};

startServer();