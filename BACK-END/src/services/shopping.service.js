const shoppingRepository = require('../repositories/shopping.repository');
const shoppingDetailRepository = require('../repositories/shoppingdetails.repository')
const barcodeRepository = require('../repositories/Barcode.repository');
const productRepository = require('../repositories/products.repository');

const { sequelize } = require('../config/db');

const getAllShoppings = async () => {
    try {
        return await shoppingRepository.findAllShoppings();
    } catch (error) {
        throw error;
    }
};

const getOneShopping = async (id) => {
    try {
        return await shoppingRepository.findShoppingById(id);
    } catch (error) {
        throw error;
    }
};

// const createShopping = async (shoppingData) => {
//     try {
//         return await shoppingRepository.createShopping(shoppingData);
//     } catch (error) {
//         if (error.name === 'SequelizeUniqueConstraintError') {
//             throw new Error('Ya existe una compra con ese numero de factura.');
//         }
//         throw error;
//     }
// };

const createShopping = async (shoppingData, shoppingDetails) => {
    const transaction = await sequelize.transaction();
    try {
        // Crear la compra
        const newShopping = await shoppingRepository.createShopping(shoppingData, { transaction });

        // Crear los detalles de compra
        for (const detail of shoppingDetails) {
            detail.idCompra = newShopping.idCompra;

            const newShoppingDetail = await shoppingDetailRepository.createShoppingDetail(detail, { transaction });

            // Actualizar el valor total de la compra
            const subtotal = detail.cantidadProducto * detail.precioCompraUnidad;
            newShopping.valorCompra += subtotal;

            // Crea un código de barras
            const newBarCode = {
                idProducto: newShoppingDetail.idProducto,
                codigoBarra: newShoppingDetail.codigoBarra,
            }
            await barcodeRepository.createBarcode(newBarCode, { transaction });

            // Actualiza el stock de un producto
            product = await productRepository.findProductById(newBarCode.idProducto)
            const newStock = product.stock + newShoppingDetail.cantidadProducto;
            await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });
        }
        // Guardar cambios en la compra
        await newShopping.save({ transaction });

        await transaction.commit();
        return newShopping;
    } catch (error) {
        // Deshace todo en caso de error 
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe una compra con ese numero de factura.');
        }
        throw new Error('SERVICE:' + error.message);
    }
};

const updateShoppingStatus = async (id, status) => {
    try {
        const result = await shoppingRepository.updateShoppingStatus(id, status);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar el estado de la compra');
        }
        return result;
    } catch (error) {
        throw new Error('SERVICE: Error al cambiar el estado de la compra: ' + error.message);
    }
}


const deleteOneShopping = async (id) => {
    try {
        const result = await shoppingRepository.deleteShopping(id);
        if (result === 0) {
            throw new Error('Compra no encontrada');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

const updateValorCompra = async (id, newValorCompra) => {
    try {
        const result = shoppingRepository.updateValorShopping(id, newValorCompra);
        if (!result) {
            throw new Error("SERVICE: no se pudo actualizar el valor de la compra.");

        }
        return result;
    } catch (error) {
    }
};


module.exports = {
    getAllShoppings,
    getOneShopping,
    createShopping,
    updateShoppingStatus,
    deleteOneShopping,
    updateValorCompra
};
