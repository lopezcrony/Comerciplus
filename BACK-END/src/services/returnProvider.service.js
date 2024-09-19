const { sequelize } = require('../config/db');
const returnProviderRepository = require('../repositories/returnProvider.repository');
const barCodeRepository = require('../repositories/Barcode.repository');
const providersRepository= require('../repositories/providers.repository');
const productRepository = require ('../repositories/products.repository');
const { response } = require('express');
const { json } = require('sequelize');

const getAllReturnProvider = async () => {
    try {
        return await returnProviderRepository.findAllReturnProvider();
    } catch (error) {
        throw error;
    }
};

const getOneReturnProvider = async (id) => {
    try {
        return await returnProviderRepository.findReturnProviderById(id);
    } catch (error) {
        throw error;
    }
};

const createReturnProvider = async (returnProviderData) => {
    const transaction=await sequelize.transaction()

    try {

        //Se valida que el codigo de barras exista
        const barCode= await barCodeRepository.findBarcodeByCode(returnProviderData.CodigoProducto, {transaction})

        if (!barCode) throw new Error('SERVICE: No se encontró el código de barras.');

        //Se asigna el Id de codigo de barras
        if(barCode){
            const IdCode=barCode.idCodigoBarra
            returnProviderData.idCodigoBarra=IdCode
        }
        //Se asigna el nombre relacionado con el Id
        // if (barCode) {
        //     const Codigo = barCode.codigoBarra;
        //     returnProviderData.CodigoProducto = Codigo;
        // }

        const provider= await providersRepository.findProviderById(returnProviderData.idProveedor, {transaction})

        if (!provider) throw new Error('SERVICE: No se encontró el proveedor.');

        // if (provider) {
        //     const NameProvider = provider.nombreProveedor;

        //     returnProviderData.NombreProveedor = NameProvider;

        // }

        //  Se valida que exista el producto utilizando el ID del producto del código de barras
        const product = await productRepository.findProductById(barCode.idProducto, { transaction });
        if (!product) throw new Error('SERVICE: Producto no encontrado.');
        if(product.stock < returnProviderData.cantidad) throw new Error('Stock insuficiente');
        const newStock = product.stock - returnProviderData.cantidad;
        await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });     




        const NewRturnProvider=await returnProviderRepository.createReturnProvider(returnProviderData, {transaction})
        await transaction.commit();
        return NewRturnProvider;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe el registro de una pérdida con esa información.');
        }
        throw error;
    }
};


const updateReturnProvider = async (id, status) => {
    try {
        const result = await returnProviderRepository.updateReturnProviderStatus(id, status);
        if (!result) {
            throw new Error('SERVICE: El estado de la perdida no se pudo actualizar');
        }
        return result;
    } catch (error) {
        throw new Error('Error al cambiar el estado de la venta Service: ' + error.message);
    }
};


module.exports = {
    getAllReturnProvider,
    getOneReturnProvider,
    createReturnProvider,    
    updateReturnProvider,
};
