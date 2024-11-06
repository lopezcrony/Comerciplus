const { Op } = require('sequelize');
const Sales = require('../models/sales.model');
const Purchases = require('../models/shopping.model');

const getSalesOfTheDay = async (date) => {
    return await Sales.findAll({
        where: {
            fechaVenta: {
                [Op.gte]: date,
            },
        },
        attributes: ['totalVenta', 'fechaVenta'],
    });
};

const getPurchasesOfTheDay = async (date) => {
    return await Purchases.findAll({
        where: {
            fechaCompra: {
                [Op.gte]: date,
            },
        },
        attributes: ['valorCompra', 'fechaCompra'],
    });
};

module.exports = {
    getSalesOfTheDay,
    getPurchasesOfTheDay,
};