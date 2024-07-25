const connection = require('../database/db');

const getAllRoles = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM roles', (err, results) => {
            (err) ? reject(err) : resolve(results);
        });
    });
};

const getOneRoles = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM roles WHERE idRol = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results[0]);
        });
    });
};

const createNewRol = (roles) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO roles (nombreRol)
            VALUES (?)
        `;
        // Destructuración del objeto proveedor
        const { nombreRol } = roles;
        
        connection.query(query, [nombreRol], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

const updateOneRol = (roles) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE roles 
            SET nombreRol = ?
            WHERE idRol  = ?`;

        const { idRol, nombreRol } = roles;

        connection.query(query, [ nombreRol, idRol],  (err, results) => {
            err ? reject(err) : resolve(results);
        })
    });
};

const deleteOneRol = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM roles WHERE idRol = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

module.exports = {
    getAllRoles,
    getOneRoles,
    createNewRol,
    updateOneRol,
    deleteOneRol
}
