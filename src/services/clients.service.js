const connection = require('../database/db');

const getAllClients = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM clientes', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

const getOneClient = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM clientes WHERE idCliente = ?', [id], (err, results) => {
            (err) ? reject(err) : resolve(results[0]);
        });
    });
};

const createNewClient = (client) => {
    return new Promise((resolve, reject) => {

        const { cedulaCliente, nombreCliente, apellidoCliente, direccionCliente, telefonoCliente } = client;

        const query = `
            INSERT INTO clientes (cedulaCliente, nombreCliente, apellidoCliente, direccionCliente, telefonoCliente)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        connection.query(query, [cedulaCliente, nombreCliente, apellidoCliente, direccionCliente, telefonoCliente], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

const updateOneClient = (client) => {
    return new Promise((resolve, reject) => {
        const query = `
        UPDATE clientes 
        SET cedulaCliente = ?, 
            nombreCliente = ?, 
            apellidoCliente = ?, 
            direccionCliente = ?,
            telefonoCliente = ?
        WHERE idCliente  = ?`;

        const { idCliente, cedulaCliente, nombreCliente, apellidoCliente, direccionCliente, telefonoCliente } = client;

        connection.query(query, [cedulaCliente, nombreCliente, apellidoCliente, direccionCliente, telefonoCliente, idCliente], (err, results) => {
            err ? reject(err) : resolve(results);
        })
    });
};

const deleteOneClient = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM clientes WHERE idCliente = ?', [id], (err, results) => {
            (err) ? reject(err) : resolve(results);
        });
    });
};

module.exports = {
    getAllClients,
    getOneClient,
    createNewClient,
    updateOneClient,
    deleteOneClient
}