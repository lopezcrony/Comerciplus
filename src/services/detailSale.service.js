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
       
        // Se valida que exista el codigo de barras
        const barCode = await barCodeRepository.findBarcodeById(detailSalesData.idCodigoBarra, { transaction });
        if (!barCode) throw new Error('SERVICE: No se encontró el código de barras.');

        //  Se valida que exista el producto utilizando el ID del producto del código de barras
        const product = await productRepository.findProductById(barCode.idProducto, { transaction });
        if (!product) throw new Error('SERVICE: Producto no encontrado.');

        if (product.stock < detailSalesData.cantidadProducto) {
            throw Error(`Existencias de producto insuficientes. Actualmente hay ${product.stock} de ${product.nombreProducto}`);
        }

        const subtotal = product.precioVenta * detailSalesData.cantidadProducto;

        // Se asigna el resultado del subtotal al campo 'subtotal'
        detailSalesData.subtotal = subtotal;

        // Se crea el detalle de venta
        const newDetailSale = await detailSalesRepository.createdetailSale(detailSalesData, { transaction });

        // Se actualiza / incrementa el valor total de la venta
        sale.totalVenta += subtotal;
        await sale.save({ transaction })
        
        // Se actualiza el stock del producto
        const newStock = product.stock - detailSalesData.cantidadProducto;
        await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });

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
