const salesRepository = require('../repositories/sales.repository');
const detailSaleRepository = require('../repositories/detailSales.repository');
const productRepository = require ('../repositories/products.repository');

const { sequelize } = require('../config/db');

const getAllSales = async () => {
    try {
        return await salesRepository.findAllSales();
    } catch (error) {
        throw error;
    }
};

const getOneSales = async (id) => {
    try {
        return await salesRepository.findSalesById(id);
    } catch (error) {
        throw error;
    }
};

const createSale = async (saleData, saleDetailData) => {
    const transaction = await sequelize.transaction();
    try {
        const sale = await salesRepository.createSales(saleData, { transaction });

        for (const detail of saleDetailData) {
            detail.idVenta = sale.idVenta;

            //  Se valida que exista el producto
            const product = await productRepository.findProductById(detail.idProducto, { transaction });
            if (!product) throw new Error('Producto no encontrado.');

            // Validamos si el stock es suficiente
            if (product.stock < detail.cantidadProducto) {
                throw new Error(`Existencias insuficientes. Actualmente hay ${product.stock} de ${product.nombreProducto}`);
            }
            // Se crea el detalle de la venta
            const newSaleDetail = await detailSaleRepository.createdetailSale(detail, { transaction });

            // se actualiza el stock del producto
            const newStock = product.stock - newSaleDetail.cantidadProducto;
            await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });

            // Se actualiza el total de la venta
            sale.totalVenta += newSaleDetail.subtotal;
        }
        await sale.save({ transaction });

        await transaction.commit();

        return sale;

    } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
    }
};


const updateSalesStatus = async (id, status) => {
    try {
        const result = await salesRepository.updateSalesStatus(id, status);
        if (!result) {
            throw new Error('SERVICE: El estado de la venta no se pudo actualizar');
        }
        return result;
    } catch (error) {
        throw new Error('Error al cambiar el estado de la venta: ' + error.message);
    }
};

const updateTotalSale = async (id, newTotalSale) => {
    try {
        const result = salesRepository.updateTotalSale(id, newTotalSale);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar el total de la venta.')
        }
        return result;
    } catch (error) {

    }
};

const deleteSale = async (id) => {
    try {
        await salesRepository.deleteSale(id);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllSales,
    getOneSales,
    createSale,
    updateTotalSale,
    updateSalesStatus,
};
