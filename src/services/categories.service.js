const connection = require('../database/db');

const GetAllCategoriesService = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM categorias_productos', (err, results) => {
            (err)? reject(err):resolve(results);
        });
    });
};

const GetOneCategorieService = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM categorias_productos WHERE idCategoria = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results[0]);
        });
    });
};

const CreateNewCategorieService = (newCategorie) => {
    return new Promise((resolve, reject) => {

        // Destructuración del objeto proveedor
        const { nombreCategoria, descripcionCategoria } = newCategorie;

        const query = `
            INSERT INTO categorias_productos (nombreCategoria, descripcionCategoria)
            VALUES (?, ?)
        `;
        
        connection.query(query, [nombreCategoria, descripcionCategoria], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

const updateOneCategorieService = (setCategorie) => {
    return new Promise((resolve, reject) => {

        const { idCategoria ,nombreCategoria, descripcionCategoria } = setCategorie;

        const query = `
            UPDATE categorias_productos 
            SET nombreCategoria = ?, 
                descripcionCategoria = ? 
            WHERE idCategoria  = ?`;

        connection.query(query, [nombreCategoria, descripcionCategoria, idCategoria],  (err, results) => {
            err ? reject(err) : resolve(results);
        })
    });
};

const deleteOneCategorieService = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM categorias_productos WHERE idCategoria = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

module.exports = {
    GetAllCategoriesService,
    GetOneCategorieService,
    CreateNewCategorieService,
    updateOneCategorieService,
    deleteOneCategorieService
}