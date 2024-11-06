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


const cancelSale = async (id) => {
    const transaction = await sequelize.transaction();
    try {
        const sale = await salesRepository.findSalesById(id);
        if(!sale) return res.status(404).json({ message: 'Venta no encontrada.'})
              
        // Actualizar stock de productos
        const detailSale = await detailSaleRepository.findAllDetailBySale(id)
        
        for ( const d of detailSale){
            const product = await productRepository.findProductById(d.idProducto, { transaction });
            if (!product) throw new Error('SERVICE: Producto no encontrado.');

            console.log('Producto:', product);

            const newStock = product.stock + d.cantidadProducto;

            console.log('Nuevo Stock:', newStock);

            await productRepository.updateProductoStock(product.idProducto, newStock, { transaction }); 
        }
        const result = await salesRepository.cancelSale(id, { transaction });

        if (!result) throw new Error('SERVICE: No se pudo anular la Venta.');
        
        await transaction.commit();
        return result;
    } catch (error) {
        throw new Error('SERVICE: Error al anular la venta: ' + error.message);
    }
};

const deleteSale = async (id) => {
    const transaction = await sequelize.transaction();
    try {
        // Primero verificamos si la venta existe
        const sale = await salesRepository.findSalesById(id);
        if (!sale) {
            throw new Error('Venta no encontrada');
        }

        const detailSale = await detailSaleRepository.findAllDetailBySale(id);
        if (!detailSale || detailSale.length === 0) {
            throw new Error('No se encontraron detalles de la venta');
        }

        // Actualizar el stock de los productos
        for (const detail of detailSale) {
            const product = await productRepository.findProductById(detail.idProducto, { transaction });
            if (!product) {
                throw new Error(`Producto ${detail.idProducto} no encontrado`);
            }

            const newStock = product.stock + detail.cantidadProducto;
            await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });
        }

        // Eliminar los detalles de la venta
        const deletedDetails = await detailSaleRepository.deleteAllDetailsBySale(id, transaction);
        if (!deletedDetails) {
            throw new Error('Error al eliminar los detalles de la venta');
        }

        // Eliminar la venta principal
        const deletedSale = await salesRepository.deleteSale(id, transaction);
        if (deletedSale === 0) {
            throw new Error('No se pudo eliminar la Venta');
        }

        await transaction.commit();
        return { message: 'Venta eliminada correctamente' };
    } catch (error) {
        await transaction.rollback();
        throw error; // Propagamos el error al controller
    }
};

module.exports = {
    getAllSales,
    getOneSales,
    createSale,
    updateTotalSale,
    cancelSale,
    deleteSale
};
