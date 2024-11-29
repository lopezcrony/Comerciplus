const barcodeService = require('../services/barcodes.service')

const getAllBarcodesByProduct = async (req, res) => {
    try {
        const { idProducto } = req.params;
        const barcode = await barcodeService.getAllBarcodesByProduct(idProducto);
        res.status(200).json(barcode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllBarcodes = async (req, res) => {
    try {
        const barcode = await barcodeService.getAllBarcodes();
        res.status(200).json(barcode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOneBarcode = async (req, res) => {
    try {
        const barcode = await barcodeService.getOneBarcode(req.params.id);
        res.status(200).json(barcode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductByBarcode = async (req, res) => {
    try {
        const barcode = await barcodeService.getProductByBarcode(req.params.barcode);
        res.status(200).json(barcode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBarcode = async (req, res) => {
    try {
        const newBarcode = await barcodeService.createBarcode(req.body);
        res.status(201).json({ message: 'Código registrado exitosamente.', newBarcode });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBarcode = async (req, res) => {
    try {
        const updatedBarcode = await barcodeService.updateBarcode(req.params.id, req.body);
        res.status(200).json({ message: 'Código actualizado exitosamente', updatedBarcode});
    } catch (error) {
        if (error.message === 'El codigo ya existe.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

const deleteOneBarcode = async (req, res) => {
    try {
        const barcode = await barcodeService.deleteOneBarcode(req.params.id);
        if(barcode){
        res.json({ message: 'Codigo eliminado con éxito.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
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
}