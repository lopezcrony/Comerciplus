const { Router } = require("express");
const detailSalesController = require("../controllers/detailSale.controller");

const router = Router();

router
    .get('/', detailSalesController.GetAllDetailSales)
    .get('/:id', detailSalesController.GetOneDetailSales)
    .post('/', detailSalesController.CreateNewDetailSale)

module.exports = router;
