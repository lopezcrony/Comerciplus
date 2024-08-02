const connection = require('../config/db');

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM usuarios', (err, results) => {
            (err) ? reject(err) : resolve(results);
        });
    });
};

const getOneUsers = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM usuarios WHERE idUsuario = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results[0]);
        });
    });
};

const createNewUser = (users) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO usuarios (cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contraseñaUsuario)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        // Destructuración del objeto usuario
        const { cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contraseñaUsuario } = users;
        
        connection.query(query, [cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contraseñaUsuario], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

const updateOneUser = (users) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE usuarios 
            SET cedulaUsuario = ?, 
                nombreUsuario = ?, 
                apellidoUsuario = ?, 
                telefonoUsuario = ?, 
                correoUsuario = ?, 
                contraseñaUsuario = ? 
            WHERE idUsuario  = ?`;

        const { idUsuario, cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contraseñaUsuario } = users;

        connection.query(query, [cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contraseñaUsuario, idUsuario],  (err, results) => {
            err ? reject(err) : resolve(results);
        })
    });
};

const deleteOneUser = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM usuarios WHERE idUsuario = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

module.exports = {
    getAllUsers,
    getOneUsers,
    createNewUser,
    updateOneUser,
    deleteOneUser
};
