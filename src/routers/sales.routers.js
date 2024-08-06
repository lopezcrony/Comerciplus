const { Router } = require("express");
const salesController = require("../controllers/sales.controller");
const {validateSales}=require("../middlewares/sales.validations")

const router = Router();

router
    .get('/', salesController.GetAllSales)
    .get('/:id', salesController.GetOneSale)
    .post('/',validateSales, salesController.CreateNewSale)
    .patch('/:id',validateSales, salesController.updateSaleStatus)    

module.exports = router;
