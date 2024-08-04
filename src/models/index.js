const sequelize = require('../config/db');
const provider = require('./providers.model');
const categories = require('./categories.model');
const client = require('./clients.model');
const credit = require('./credits.model');
const installment = require('./installments.model');

const models = {
    provider,
    categories,
    client,
    credit,
    installment,
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
