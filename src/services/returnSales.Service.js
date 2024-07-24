const connection = require('../database/db');

const getAllReturnSales = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM devolucionventa', (err, results) => {
            (err) ? reject(err) : resolve(results);
        });
    });
};

const getOneReturnSales = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM devolucionventa WHERE idDevolucionVenta = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results[0]);
        });
    });
};

const createNewReturnSales = (returSale) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO devolucionventa (idDetalleVenta, idCodigoBarra, cantidad, fechaDevolucion, motivoDevolucion, tipoReembolso, valorDevolucion)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        // Destructuración del objeto venta
        const { idDetalleVenta, idCodigoBarra, cantidad, fechaDevolucion, motivoDevolucion, tipoReembolso, valorDevolucion } = returSale;
        
        connection.query(query, [idDetalleVenta, idCodigoBarra, cantidad, fechaDevolucion, motivoDevolucion, tipoReembolso, valorDevolucion], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

const deleteOneReturnSales = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM devolucionventa WHERE idDevolucionVenta = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

module.exports = {
    getAllReturnSales,
    getOneReturnSales,
    createNewReturnSales,
    deleteOneReturnSales
};
