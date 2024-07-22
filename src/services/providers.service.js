const connection = require('../database/db');

const getAllProviders = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM proveedores', (err, results) => {
            (err) ? reject(err) : resolve(results);
        });
    });
};

const getOneProvider = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM proveedores WHERE idProveedor = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results[0]);
        });
    });
};

const createNewProvider = (provider) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO proveedores (nitProveedor, nombreProveedor, direccionProveedor, telefonoProveedor)
            VALUES (?, ?, ?, ?)
        `;
        // Destructuración del objeto proveedor
        const { nitProveedor, nombreProveedor, direccionProveedor, telefonoProveedor } = provider;
        
        connection.query(query, [nitProveedor, nombreProveedor, direccionProveedor, telefonoProveedor], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

const updateOneProvider = (provider) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE proveedores 
            SET nitProveedor = ?, 
                nombreProveedor = ?, 
                direccionProveedor = ?, 
                telefonoProveedor = ? 
            WHERE idProveedor  = ?`;

        const { idProveedor, nitProveedor, nombreProveedor, direccionProveedor, telefonoProveedor } = provider;

        connection.query(query, [nitProveedor, nombreProveedor, direccionProveedor, telefonoProveedor, idProveedor],  (err, results) => {
            err ? reject(err) : resolve(results);
        })
    });
};

const deleteOneProvider = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM proveedores WHERE idProveedor = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

module.exports = {
    getAllProviders,
    getOneProvider,
    createNewProvider,
    updateOneProvider,
    deleteOneProvider
};
