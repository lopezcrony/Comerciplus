const { Router } = require("express");
const installmentController = require("../controllers/installments.controller");

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/:idCredito', installmentController.getInstallmentsByCredit)
    .post('/', authenticateJWT, checkPermission('Crear Abono'), installmentController.createInstallment)
    .put('/:id', installmentController.updateInstallment)
    .put('/:id/cancel', authenticateJWT, checkPermission('Anular Abono'), installmentController.cancelInstallment)

module.exports = router;
