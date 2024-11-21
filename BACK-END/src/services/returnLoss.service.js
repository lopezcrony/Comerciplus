const { sequelize } = require('../config/db');
const ReturnLossRepository = require('../repositories/returnLoss.repository');
const barCodeRepository = require('../repositories/barcode.repository');
const productRepository = require ('../repositories/products.repository');

const getAllReturnLoss = async () => {
    try {
        return await ReturnLossRepository.findAllReturnLoss();
    } catch (error) {
        throw error;
    }
};

const getOneReturnLoss = async (id) => {
    try {
        return await ReturnLossRepository.findReturnLossById(id);
    } catch (error) {
        throw error;
    }
};

const createReturnLoss = async (ReturnLossData) => {
    const transaction = await sequelize.transaction();
    
    try {

        const barCode= await barCodeRepository.findBarcodeByCode(ReturnLossData.CodigoProducto, {transaction})

        if (!barCode) throw new Error('SERVICE: No se encontró el código de barras.');

        if(barCode){
            const IdCode=barCode.idCodigoBarra
            ReturnLossData.idCodigoBarra=IdCode
        }
        
        //  Se valida que exista el producto utilizando el ID del producto del código de barras
        const product = await productRepository.findProductById(barCode.idProducto, { transaction });
        if (!product) throw new Error('SERVICE: Producto no encontrado.');


        // Se actualiza el stock del producto
        const newStock = product.stock - ReturnLossData.cantidad;
        await productRepository.updateProductoStock(product.idProducto, newStock, { transaction });     


        const NewReturn=await ReturnLossRepository.createreturnLoss(ReturnLossData, {transaction})
        await transaction.commit();

        return NewReturn;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe una perdida con el mismo ID.');
        }
        throw error;
    }
};

module.exports = {
    getAllReturnLoss,
    getOneReturnLoss,
    createReturnLoss,    
};
