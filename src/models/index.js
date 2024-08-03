const sequelize = require('../config/db');
const provider = require('./providers.model');
const client = require('./clients.model')

const models = {
    provider,
    client
};

const connectDb = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Base de datos sincronizada con éxito!.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

module.exports = { models, connectDb };
