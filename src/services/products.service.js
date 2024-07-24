const connection = require('../database/db');

const GetAllProductsService = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM productos', (err, results) => {
            (err)? reject(err):resolve(results);
        });
    });
};

const GetOneProductService = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM productos WHERE idProducto = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results[0]);
        });
    });
};

const CreateNewProductService = (newProduct) => {
    return new Promise((resolve, reject) => {

        // Destructuración del objeto proveedor
        const { idCategoria,imagenProducto,nombreProducto, stock, precioVenta } = newProduct;

        const query = `
            INSERT INTO productos (idCategoria, imagenProducto,nombreProducto,stock,precioVenta)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        connection.query(query, [idCategoria, imagenProducto,nombreProducto,stock,precioVenta], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

const updateOneProductService = (setProduct) => {
    return new Promise((resolve, reject) => {

        const { idProducto,idCategoria,imagenProducto,nombreProducto, stock, precioVenta } = setProduct;

        const query = `
            UPDATE productos 
            SET idCategoria = ?, 
                imagenProducto = ?, 
                nombreProducto= ?,
                stock= ?,
                precioVenta= ?
            WHERE idProducto  = ?
            `;
        connection.query(query, [idCategoria, imagenProducto, nombreProducto,stock,precioVenta, idProducto ],  (err, results) => {
            err ? reject(err) : resolve(results);
        })
    });
};

const deleteOneProductService = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM productos WHERE idProducto = ?', [id], (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

module.exports = {
    GetAllProductsService,
    GetOneProductService,
    CreateNewProductService,
    updateOneProductService,
    deleteOneProductService
}