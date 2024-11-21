const { sequelize } = require('../config/db');
const returnSalesRepository = require('../repositories/returnSales.repository');
const returnProviderRepository = require('../repositories/returnProvider.repository');
const barCodeRepository = require('../repositories/barcodes.repository');
const productRepository = require('../repositories/products.repository');
const providersRepository = require('../repositories/providers.repository');



const getAllReturnSales = async () => {
    try {
        return await returnSalesRepository.findAllReturnSales();
    } catch (error) {
        throw error;
    }
};

const getOneReturnSales = async (id) => {
    try {
        return await returnSalesRepository.findReturnSalesById(id);
    } catch (error) {
        throw error;
    }
};

const createReturnSales = async (ReturnSalesData) => {
    const transaction = await sequelize.transaction();

    try {
        // Se valida que el código de barras exista
        const barCode = await barCodeRepository.findBarcodeByCode(ReturnSalesData.CodigoProducto, { transaction });
        if (!barCode) throw new Error('SERVICE: No se encontró el código de barras.');

        // Se asigna el Id de código de barras
        const IdCode = barCode.idCodigoBarra;
        ReturnSalesData.idCodigoBarra = IdCode;



        // Se valida que exista el producto utilizando el ID del producto del código de barras
        const product = await productRepository.findProductById(barCode.idProducto, { transaction });
        if (!product) throw new Error('SERVICE: Producto no encontrado.');


        const provider = await providersRepository.findProviderById(ReturnSalesData.idProveedor, { transaction });
        if (!provider) throw new Error('SERVICE: No se encontró el proveedor.');
        // const NameProvider = provider.nombreProveedor;

        const valor = product.precioVenta * ReturnSalesData.cantidad;
        ReturnSalesData.valorDevolucion = valor;

        const motivo = ReturnSalesData.motivoDevolucion;
        const tipo = ReturnSalesData.tipoReembolso;

        if (motivo === 'Caducidad' && tipo === 'Producto') {
            const data = {
                idProveedor: ReturnSalesData.idProveedor,
                idCodigoBarra: IdCode,
                cantidad: ReturnSalesData.cantidad,
                fecha: ReturnSalesData.fechaDevolucion,
                motivoDevolucion: ReturnSalesData.motivoDevolucion
            };
            if (product.stock < returnProviderData.cantidad) throw new Error('Stock insuficiente');

            const newStock = product.stock - ReturnSalesData.cantidad;
            await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });

            await returnProviderRepository.createReturnProvider(data, { transaction });
        }

        if (motivo === 'Caducidad' && tipo === 'Dinero') {
            const Caducidad = {
                idProveedor: ReturnSalesData.idProveedor,
                idCodigoBarra: IdCode,
                cantidad: ReturnSalesData.cantidad,
                fecha: ReturnSalesData.fechaDevolucion,
                motivoDevolucion: ReturnSalesData.motivoDevolucion
            };

        if(product.stock < returnProviderData.cantidad) throw new Error('Stock insuficiente');

            await returnProviderRepository.createReturnProvider(Caducidad, { transaction });
        }

        if (motivo === 'Equivocación' && tipo === 'Dinero') {
            if (product.stock < returnProviderData.cantidad) throw new Error('Stock insuficiente');

            const newStock = parseInt(product.stock, 10) + parseInt(ReturnSalesData.cantidad, 10);
            await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });
        }



        const NewReturnSale = await returnSalesRepository.createreturnSales(ReturnSalesData, { transaction });
        await transaction.commit();

        return NewReturnSale;
    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe una devolución de venta con el mismo ID.');
        }
        throw error;
    }



};

const updateReturnSalesStatus = async (id, status) => {
    try {
        const result = await returnSalesRepository.updateReturnSalesStatus(id, status);
        if (!result) {
            throw new Error('SERVICE: La devolución por venta no se pudo actualizar');
        }
        return result;
    } catch (error) {
        throw new Error('Error al cambiar el estado de la devolución de venta: ' + error.message);
    }
};

const cancelReturnSale = async (id) => {
    const transaction = await sequelize.transaction();
    try {

        const returnSale = await returnSalesRepository.findReturnSalesById(id);
        if (!returnSale) {
            return res.status(404).json({ message: 'Devolución no encontrada.' })
        }

        const barcode = await barCodeRepository.findBarcodeById(returnSale.idCodigoBarra)
        // Actualizar stock de productos
        const product = await productRepository.findProductById(barcode.idProducto, { transaction });
        if (!product) throw new Error('SERVICE: Producto no encontrado.');

        const newStock = product.stock + returnSale.cantidad;
        await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });

        const result = await returnSalesRepository.cancelReturnSale(id, { transaction });

        if (!result) {
            throw new Error('SERVICE: No se pudo anular la devolución.');
        }
        await transaction.commit();
        return result;
    } catch (error) {
        throw new Error('SERVICE: Error al anular la devolución: ' + error.message);
    }
};



module.exports = {
    getAllReturnSales,
    getOneReturnSales,
    createReturnSales,
    updateReturnSalesStatus,
    cancelReturnSale
};
