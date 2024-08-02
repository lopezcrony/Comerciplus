require("dotenv").config();
const {connectToDatabase, sequelize} = require('./src/config/db');
const Server = require('./src');
const server = new Server();

const startServer = async () => {
    try {
        await connectToDatabase();

        await sequelize.sync({ alter: true });

        server.listen();
    } catch (error) {
        console.error('No se pudo inicializar el servidor:', error);
    }
};

startServer();
