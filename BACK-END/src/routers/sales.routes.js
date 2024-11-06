const { Router } = require("express");
const salesController = require("../controllers/sales.controller");
const { validateSaleWithDetails } = require("../middlewares/sales.validations")

const router = Router();

router
    .get('/', salesController.GetAllSales)
    .get('/:id', salesController.GetOneSale)
    .post('/',validateSaleWithDetails, salesController.CreateNewSale)
    .patch('/:id', salesController.updateSaleStatus)
    .put('/:id', salesController.cancelSale)
    

module.exports = router;
