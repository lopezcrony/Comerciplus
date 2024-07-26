const connection = require('../database/db');

const getAllPermissions = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM permisos', (err, results) => {
            (err) ? reject(err) : resolve(results);
        });
    });
};

const getOnePermissions = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM permiso WHERE idPermiso = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results[0]);
        });
    });
};

const createNewPermission = (permissions) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO permisos (nombrePermiso)
            VALUES (?)
        `;
        // Destructuración del objeto permisos
        const { nombrePermiso } = permissions;
        
        connection.query(query, [nombrePermiso], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

const updateOnePermission = (permissions) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE permisos 
            SET nombrePermiso = ?
            WHERE idPermiso  = ?`;

        const { idPermiso, nombrePermiso } = permissions;

        connection.query(query, [ nombrePermiso, idPermiso],  (err, results) => {
            err ? reject(err) : resolve(results);
        })
    });
};

const deleteOnePermission = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM permisos WHERE idPermiso = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

module.exports = {
    getAllPermissions,
    getOnePermissions,
    createNewPermission,
    updateOnePermission,
    deleteOnePermission
}
