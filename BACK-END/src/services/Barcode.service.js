const BarcodeRepository = require('../repositories/barcodes.repository');

const getAllBarcodesByProduct = async (idProduct) => {
    try {
        return await BarcodeRepository.findAllBarcodesByProduct(idProduct);
    } catch (error) {
        throw error;
    }
};

const getAllBarcodes = async () => {
    try {
        return await BarcodeRepository.findAllBarcodes();
    } catch (error) {
        throw error;
    }
};

const getOneBarcode = async (id) => {
    try {
        return await BarcodeRepository.findBarcodeById(id);
    } catch (error) {
        throw error;
    }
};

const getProductByBarcode = async (barcode) => {
    try {
        const barcodeInfo = await BarcodeRepository.findBarcodeByCode(barcode);

        if (!barcodeInfo) {
            throw new Error('No se encontró el producto');
        }
        return barcodeInfo;
    } catch (error) {
        console.error("Error en el servicio:", error.message);
        throw error;
    }
};


const createBarcode = async (BarcodeData) => {
    try {
        return await BarcodeRepository.createBarcode(BarcodeData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe un codigo.');
        }
        throw error;
    }
};

const updateBarcode = async (id, BarcodeData) => {
    try {
        const result = await BarcodeRepository.updateBarcode(id, BarcodeData);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar la información del codigo.');
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El codigo ya esta registrado.');
        }
        throw error;
    }
};

const deleteOneBarcode = async (id) => {
    try {
        const result = await BarcodeRepository.deleteBarcode(id);
        if (result === 0) {
            throw new Error('codigo no encontrado');
        }
        return result;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getAllBarcodesByProduct,
    getOneBarcode,
    getProductByBarcode,
    createBarcode,
    updateBarcode,
    deleteOneBarcode,
    getAllBarcodes
};
