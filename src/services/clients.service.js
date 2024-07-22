const { json } = require('body-parser');
const connection = require('../database/db');

const allClients = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM clientes', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

const oneClient = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM clientes WHERE idCliente = ?', [id], (err,results) =>{
            if(err) reject(err);
            resolve(results[0]);
        });
    });
};

module.exports = {
    allClients,
    oneClient
}