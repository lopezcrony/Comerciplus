const Barcode = require('../models/Barcode.model');

const findAllBarcodes = async () => {
    return await Barcode.findAll();
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
    throw new Error('codigo no encontrado');
};


const deleteBarcode = async (id) => {
    const result = await Barcode.destroy({
        where: { 	idCodigoBarra : id }
    });
    return result;
};


module.exports = {
    findAllBarcodes,
    findBarcodeById,
    createBarcode,
    updateBarcode,
    deleteBarcode,
};
