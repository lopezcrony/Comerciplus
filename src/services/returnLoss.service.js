const connection = require('../config/db');

const getAllReturnLoss = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM dardebaja', (err, results) => {
            (err) ? reject(err) : resolve(results);
        });
    });
};

const getOneReturnLoss = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM dardebaja WHERE idDevolucionDeBaja = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results[0]);
        });
    });
};

const createNewReturnLoss = (returLoss) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO dardebaja (idDevolucionDeBaja, idCodigoBarra, motivo, cantidad, fechaDeBaja)
            VALUES (?, ?, ?, ?, ?)
        `;
        // Destructuración del objeto perdidda
        const { idDevolucionDeBaja, idCodigoBarra, motivo, cantidad, fechaDeBaja } = returLoss;
        
        connection.query(query, [idDevolucionDeBaja, idCodigoBarra, motivo, cantidad, fechaDeBaja], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

const deleteOneReturnLoss = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM dardebaja WHERE idDevolucionDeBaja = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

module.exports = {
    getAllReturnLoss,
    getOneReturnLoss,
    createNewReturnLoss,
    deleteOneReturnLoss
};
