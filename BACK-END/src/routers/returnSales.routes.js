const { Router } = require("express");
const returnSalesController = require("../controllers/returnSales.controller");
const {validateReturnSales} = require("../middlewares/returnSales.validations");


const router = Router();

router
    .get('/', returnSalesController.GetAllReturnSale)
    .get('/:id', returnSalesController.GetOneReturnSale)
    .post('/', validateReturnSales, returnSalesController.CreateNewReturnSale)
    .patch('/:id', returnSalesController.updateReturnSalesStatus )

module.exports = router;
