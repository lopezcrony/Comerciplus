const { Router } = require("express");
const BarcodeController = require("../controllers/Barcode.controllers");
const router = Router();

router
    .get('/', BarcodeController.getAllBarcodes)
    .get('/:id', BarcodeController.getOneBarcode)
    .post('/', BarcodeController.createBarcode)
    .put('/:id', BarcodeController.updateBarcode)
    .delete('/:id', BarcodeController.deleteOneBarcode)

module.exports = router;
