const Barcode = require('../models/barcode.model.js');

const findAllBarcodesByProduct = async (idProduct) => {
    return await Barcode.findAll({where:{idProducto:idProduct}});
};

const findAllBarcodes = async () => {
    return await Barcode.findAll();
};

const findBarcodeByCode = async (codigo) => {
    return await Barcode.findOne({ 
        where: { codigoBarra: codigo },
    });
};

const findBarcodeById = async (id) => {
    return await Barcode.findByPk(id);
};

const createBarcode = async (barcodeData) => {
    return await Barcode.create(barcodeData);
};

const updateBarcode = async (id, barcodeData) => {
    const barcode = await findBarcodeById(id);
    if (barcode) {
        return await Barcode.update(barcodeData);
    }
    throw new Error('Código no encontrado');
};

const deleteBarcode = async (id) => {
    const result = await Barcode.destroy({
        where: { 	idCodigoBarra : id }
    });
    return result;
};


module.exports = {
    findAllBarcodesByProduct,
    findBarcodeById,
    createBarcode,
    updateBarcode,
    deleteBarcode,
    findBarcodeByCode,
    findAllBarcodes
};
