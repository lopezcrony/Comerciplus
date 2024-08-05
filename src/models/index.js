const sequelize = require('../config/db');
const provider = require('./providers.model');
const categories = require('./categories.model');
const products = require('./products.model');
const barcode= require('./Barcode.model');
const client = require('./clients.model');
const credit = require('./credits.model');
const installment = require('./installments.model');
const shoppingdetails = require('./shoppingdetails.model');
const creditDetail= require('./creditDetail.model');
const shopping = require('./shopping.model');
const returnLoss =require('./returnLoss.model');
const returnSale =require('./returnSales.model');
const returnProvider =require('./returnProvider.model');
const sales =require('./sales.model')




const models = {
    provider,
    categories,
    products,
    barcode,
    client,
    credit,
    creditDetail,
    installment,
    shoppingdetails,
    shopping,
    returnLoss,
    sales,
    returnProvider,
    returnSale
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
