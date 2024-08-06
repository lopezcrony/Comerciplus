const { Router } = require("express");
const BarcodeController = require("../controllers/Barcode.controllers");
const router = Router();

router
    .get('/:idProduct', BarcodeController.getAllBarcodesByProduct)
    .get('/:id', BarcodeController.getOneBarcode)
    .post('/', BarcodeController.createBarcode)
    .put('/:id', BarcodeController.updateBarcode)
    .delete('/:id', BarcodeController.deleteOneBarcode)

module.exports = router;
