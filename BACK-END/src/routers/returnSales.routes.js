const { Router } = require("express");
const returnSalesController = require("../controllers/returnSales.controller");
const {validateReturnSales} = require("../middlewares/returnSales.validations");

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/', returnSalesController.GetAllReturnSale)
    .get('/:id', returnSalesController.GetOneReturnSale)
    .post('/', authenticateJWT, checkPermission('Crear Devolución'), validateReturnSales, returnSalesController.CreateNewReturnSale)
    .patch('/:id', returnSalesController.updateReturnSalesStatus )
    .put('/:id', authenticateJWT, checkPermission('Anular Devolución'), returnSalesController.cancelReturnSale)

module.exports = router;
