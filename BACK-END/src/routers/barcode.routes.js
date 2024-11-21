const { Router } = require("express");
const BarcodeController = require("../controllers/barcode.controllers");
const router = Router();

router
    .get('/:idProducto', BarcodeController.getAllBarcodesByProduct)
    .get('/', BarcodeController.getAllBarcodes)
    .get('/:id', BarcodeController.getOneBarcode)
    .get('/codigo/:barcode', BarcodeController.getProductByBarcode)
    .post('/', BarcodeController.createBarcode)
    .put('/:id', BarcodeController.updateBarcode)
    .delete('/:id', BarcodeController.deleteOneBarcode)

module.exports = router;
