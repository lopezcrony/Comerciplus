const sequelize = require('../config/db');
const provider = require('./providers.model');
const categories = require('./categories.model');
const products = require('./products.model');
const barcode= require('./Barcode.model');
const client = require('./clients.model');
const credit = require('./credits.model');
const installment = require('./installments.model');
const shopping = require('./shopping.model');

const models = {
    provider,
    categories,
    products,
    barcode,
    client,
    credit,
    installment,
    shopping,
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
