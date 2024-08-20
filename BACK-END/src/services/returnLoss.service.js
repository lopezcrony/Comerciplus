const { sequelize } = require('../config/db');
const ReturnLossRepository = require('../repositories/returnLoss.repository');
const barCodeRepository = require('../repositories/Barcode.repository');
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

        
        // Se valida que exista el codigo de barras
        const barCode = await barCodeRepository.findBarcodeById(ReturnLossData.idCodigoBarra, { transaction });
        if (!barCode) throw new Error('SERVICE: No se encontró el código de barras.');

        //  Se valida que exista el producto utilizando el ID del producto del código de barras
        const product = await productRepository.findProductById(barCode.idProducto, { transaction });
        if (!product) throw new Error('SERVICE: Producto no encontrado.');

        // const CodigoPerdida=getAllReturnLoss(ReturnLossData.idCodigoBarra)

        if (barCode) {
            const Codigo = barCode.codigoBarra; 

            ReturnLossData.CodigoProducto = Codigo;
        }

        if(product){
            const nombreProducto= product.nombreProducto;

            ReturnLossData.NombreProducto= nombreProducto
        }

        
        


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
