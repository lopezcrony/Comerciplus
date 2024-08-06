const sequelize = require('../config/db');

// ------------------ ACCESO ------------------
const roles = require('./roles.model');
const users = require('./users.model');
// ------------------ PRODUCTOS ------------------
const categories = require('./categories.model');
const products = require('./products.model');
const barcode = require('./Barcode.model');
// ------------------ COMPRAS ------------------
const provider = require('./providers.model');
const shopping = require('./shopping.model');
const shoppingdetails = require('./shoppingdetails.model');
// ------------------ CRÉDITOS ------------------
const client = require('./clients.model');
const credit = require('./credits.model');
const creditDetail= require('./creditDetail.model');
const installment = require('./installments.model');
// ------------------ VENTAS ------------------
const sales = require('./sales.model')
const detailSale = require ('./detailSale.model');
// ------------------ DEVOLUCIONES ------------------
const returnLoss = require('./returnLoss.model');
const returnSale = require('./returnSales.model');
const returnProvider = require('./returnProvider.model');


const models = {
    roles,
    users,  
    categories,
    products,
    barcode,
    provider,
    shopping,
    shoppingdetails,
    client,
    credit,
    creditDetail,
    installment,
    sales,
    detailSale,
    returnLoss,
    returnSale,
    returnProvider,
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

