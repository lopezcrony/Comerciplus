const { Router } = require("express");
const returnSalesController = require("../controllers/returnSales.controller");

const router = Router();

router
    .get('/', returnSalesController.GetAllReturnSale)
    .get('/:id', returnSalesController.GetOneReturnSale)
    .post('/', returnSalesController.CreateNewReturnSale)

module.exports = router;
