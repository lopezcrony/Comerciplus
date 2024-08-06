const { Router } = require("express");
const detailSalesController = require("../controllers/detailSale.controller");
const {validateDetalleVenta} = require("../middlewares/detailSale.validations");


const router = Router();

router
    .get('/', detailSalesController.GetAllDetailSales)
    .get('/:id', detailSalesController.GetOneDetailSales)
    .post('/', validateDetalleVenta, detailSalesController.CreateNewDetailSale)

module.exports = router;
