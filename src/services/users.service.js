const bcrypt = require('bcrypt');
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
    return new Promise(async (resolve, reject) => {
        const query = `
            INSERT INTO usuarios (cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contraseñaUsuario)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        // Encriptar la contraseña antes de guardar
        try {
            const hashedPassword = await bcrypt.hash(users.contraseñaUsuario, 10);
            const { cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario } = users;
            
            connection.query(query, [cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, hashedPassword], (err, results) => {
                err ? reject(err) : resolve(results);
            });
        } catch (error) {
            reject(error);
        }
    });
};

const updateOneUser = async (users) => {
    return new Promise(async (resolve, reject) => {
        const query = `
            UPDATE usuarios 
            SET cedulaUsuario = ?, 
                nombreUsuario = ?, 
                apellidoUsuario = ?, 
                telefonoUsuario = ?, 
                correoUsuario = ?, 
                contraseñaUsuario = ? 
            WHERE idUsuario = ?`;

        // Encriptar la nueva contraseña si es proporcionada
        try {
            let hashedPassword = users.contraseñaUsuario;
            if (users.contraseñaUsuario) {
                hashedPassword = await bcrypt.hash(users.contraseñaUsuario, 10);
            }
            const { idUsuario, cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario } = users;

            connection.query(query, [cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, hashedPassword, idUsuario], (err, results) => {
                err ? reject(err) : resolve(results);
            });
        } catch (error) {
            reject(error);
        }
    });
};

// const updateOneUser = (users) => {
//     return new Promise((resolve, reject) => {
//         const query = `
//             UPDATE usuarios 
//             SET cedulaUsuario = ?, 
//                 nombreUsuario = ?, 
//                 apellidoUsuario = ?, 
//                 telefonoUsuario = ?, 
//                 correoUsuario = ?, 
//                 contraseñaUsuario = ? 
//             WHERE idUsuario  = ?`;

//         const { idUsuario, cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contraseñaUsuario } = users;

//         connection.query(query, [cedulaUsuario, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contraseñaUsuario, idUsuario],  (err, results) => {
//             err ? reject(err) : resolve(results);
//         })
//     });
// };

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
