const shoppingDetailRepository = require('../repositories/shoppingdetails.repository');
const barcodeRepository = require('../repositories/Barcode.repository');
const productRepository = require('../repositories/products.repository');
const shoppingRepository = require('../repositories/shopping.repository');
const { sequelize } = require('../config/db');

const getAllShoppingDetails = async () => {
    try {
        return await shoppingDetailRepository.findAllShoppingDetails();
    } catch (error) {
        throw error;
    }
};

const getOneShoppingDetail = async (id) => {
    try {
        return await shoppingDetailRepository.findShoppingDetailById(id);
    } catch (error) {
        throw error;
    }
};

const createShoppingDetail = async (shoppingdetailData) => {
    const transaction = await sequelize.transaction();
    try {

        const shopping = await shoppingRepository.findShoppingById(shoppingdetailData.idCompra, { transaction });
        if(!shopping) throw new Error('SERVICE: No se encontró la compra.');


        const existingDetail = await shoppingDetailRepository.findShoppingDetailByCompraAndProducto(
            shoppingdetailData.idCompra, 
            shoppingdetailData.idProducto,
            shoppingdetailData.codigoBarra
        );

        if (existingDetail) {
            throw new Error('Ya existe un detalle de compra con este producto y código de barra para la misma compra.');
        }
        const newShoppingDetail = await shoppingDetailRepository.createShoppingDetail(shoppingdetailData,{ transaction });
        const newBarCode = {
            idProducto:newShoppingDetail.idProducto,
            codigoBarra:newShoppingDetail.codigoBarra,
        }

        const subtotal = shoppingdetailData.cantidadProducto * shoppingdetailData.precioCompraUnidad;
        // Se actualiza / incrementa el valor total de la compra
        shopping.valorCompra += subtotal;
        await shopping.save({ transaction })

        await barcodeRepository.createBarcode(newBarCode,{ transaction });
        product = await productRepository.findProductById(newBarCode.idProducto)
        // Se actualiza el stock del producto
        const newStock = product.stock + shoppingdetailData.cantidadProducto;
        await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });

        await transaction.commit();
        return newShoppingDetail;
    } catch (error) {
          //Deshace todo
        await transaction.rollback();
        throw new Error('SERVICE:' + error.message);
    }
};


const updateShoppingDetail = async (id, ShoppingdetailData) => {
    try {
        const result = await shoppingDetailRepository.updateShoppingDetail(id, ShoppingdetailData);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar la información del detalle de la compra.');
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El detalle ya esta registrado.');
        }
        throw error;
    }
};


const deleteOneShoppingDetail = async (id) => {
    try {
        const result = await shoppingDetailRepository.deleteShoppingDetail(id);
        if (result === 0) {
            throw new Error('Detalle de la compra no encontrado');
        }
        return result;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getAllShoppingDetails,
    getOneShoppingDetail,
    createShoppingDetail,
    updateShoppingDetail,
    deleteOneShoppingDetail,
};
