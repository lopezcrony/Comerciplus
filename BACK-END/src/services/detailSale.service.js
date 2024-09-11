const { sequelize } = require('../config/db');
const detailSalesRepository = require('../repositories/detailSales.repository');
const salesRepository = require('../repositories/sales.repository');
const barCodeRepository = require('../repositories/Barcode.repository');
const productRepository = require ('../repositories/products.repository');

const getAlldetailSales = async () => {
    try {
        return await detailSalesRepository.findAlldetailSale();
    } catch (error) {
        throw error;
    }
};

const getOnedetailSales = async (id) => {
    try {
        return await detailSalesRepository.finddetailSalesById(id);
    } catch (error) {
        throw error;
    }
};

const createdetailSales = async (detailSalesData) => {
    const transaction = await sequelize.transaction();
    try {
        // Se valida que exista la venta
        const sale = await salesRepository.findSalesById(detailSalesData.idVenta, { transaction });
        if(!sale) throw new Error('SERVICE: No se encontró la venta.');

        //  Se valida que exista el producto
        const product = await productRepository.findProductById(detailSalesData.idProducto, { transaction });
        if (!product) throw new Error('SERVICE: Producto no encontrado.');

        // Validamos si el stock es suficiente
        if (product.stock < detailSalesData.cantidadProducto) {
            throw new Error(`Existencias de producto insuficientes. Actualmente hay ${product.stock} de ${product.nombreProducto}`);
        }

        // Eliminamos el cálculo del subtotal ya que viene del frontend
        // const subtotal = product.precioVenta * detailSalesData.cantidadProducto;
        // detailSalesData.subtotal = subtotal;

        // Creamos el detalle de venta con los datos proporcionados por el frontend
        const newDetailSale = await detailSalesRepository.createdetailSale(detailSalesData, { transaction });

        // Se actualiza / incrementa el valor total de la venta
        sale.totalVenta += detailSalesData.subtotal;
        await sale.save({ transaction });

        // Se actualiza el stock del producto
        const newStock = product.stock - detailSalesData.cantidadProducto;
        await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });

        // Confirmamos la transacción
        await transaction.commit();
        return newDetailSale;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


module.exports = {
    getAlldetailSales,
    getOnedetailSales,
    createdetailSales,
};
