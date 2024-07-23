const connection = require('../database/db');

const getAllSales = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM ventas', (err, results) => {
            (err) ? reject(err) : resolve(results);
        });
    });
};

const getOneSale = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM ventas WHERE idVenta = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results[0]);
        });
    });
};

const createNewSale = (sale) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO ventas (fechaVenta, totalVenta, estadoVenta)
            VALUES (?, ?, ?)
        `;
        // Destructuración del objeto venta
        const { fechaVenta, totalVenta, estadoVenta } = sale;
        
        connection.query(query, [fechaVenta, totalVenta, estadoVenta], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

const deleteOneSale = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM ventas WHERE idVenta = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

module.exports = {
    getAllSales,
    getOneSale,
    createNewSale,
    deleteOneSale
};
