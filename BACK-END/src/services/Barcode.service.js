const BarcodeRepository = require('../repositories/Barcode.repository');

const getAllBarcodesByProduct = async () => {
    try {
        return await BarcodeRepository.findAllBarcodesByProduct();
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
    createBarcode,
    updateBarcode,
    deleteOneBarcode,
};
