const { Router } = require("express");
const salesController = require("../controllers/sales.controller");
const { validateSaleWithDetails } = require("../middlewares/sales.validations")

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/', salesController.GetAllSales)
    .get('/:id', salesController.GetOneSale)
    .post('/', authenticateJWT, checkPermission('Crear Venta'), salesController.CreateNewSale)
    .patch('/:id', authenticateJWT, checkPermission('Anular Venta'), salesController.updateSaleStatus)    
    
module.exports = router;
