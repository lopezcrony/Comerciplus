const { sequelize } = require('../config/db');
const returnSalesRepository = require('../repositories/returnSales.repository');
const returnProviderRepository = require('../repositories/returnProvider.repository');
const barCodeRepository = require('../repositories/Barcode.repository');
const productRepository = require('../repositories/products.repository');
const providersRepository = require('../repositories/providers.repository');

const { and } = require('sequelize');


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

        // Se asigna el nombre relacionado con el Id
        const Codigo = barCode.codigoBarra;
        ReturnSalesData.CodigoProducto = Codigo;

        // Se valida que exista el producto utilizando el ID del producto del código de barras
        const product = await productRepository.findProductById(barCode.idProducto, { transaction });
        if (!product) throw new Error('SERVICE: Producto no encontrado.');
        const nombreProducto = product.nombreProducto;
        ReturnSalesData.NombreProducto = nombreProducto;

        const provider = await providersRepository.findProviderById(ReturnSalesData.idProveedor, { transaction });
        if (!provider) throw new Error('SERVICE: No se encontró el proveedor.');
        const NameProvider = provider.nombreProveedor;

        const valor = product.precioVenta * ReturnSalesData.cantidad;
        ReturnSalesData.valorDevolucion = valor;

        const motivo = ReturnSalesData.motivoDevolucion;
        const tipo = ReturnSalesData.tipoReembolso;

        if (motivo === 'Caducidad' && tipo === 'Producto') {
            const data = {
                idProveedor: ReturnSalesData.idProveedor,
                NombreProveedor: NameProvider,
                idCodigoBarra: IdCode,
                CodigoProducto: Codigo,
                cantidad: ReturnSalesData.cantidad,
                fecha: ReturnSalesData.fechaDevolucion,
                motivoDevolucion: ReturnSalesData.motivoDevolucion
            };
            const newStock = product.stock - ReturnSalesData.cantidad;
            await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });

            await returnProviderRepository.createReturnProvider(data, { transaction });
        }

        if (motivo === 'Caducidad' && tipo === 'Dinero') {
            const Caducidad = {
                idProveedor: ReturnSalesData.idProveedor,
                NombreProveedor: NameProvider,
                idCodigoBarra: IdCode,
                CodigoProducto: Codigo,
                cantidad: ReturnSalesData.cantidad,
                fecha: ReturnSalesData.fechaDevolucion,
                motivoDevolucion: ReturnSalesData.motivoDevolucion
            };

            await returnProviderRepository.createReturnProvider(Caducidad, { transaction });
        }

        if (motivo === 'Equivocación' && tipo === 'Dinero') {
            const newStock =parseInt(product.stock, 10) + parseInt(ReturnSalesData.cantidad, 10);
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



module.exports = {
    getAllReturnSales,
    getOneReturnSales,
    createReturnSales,
};
