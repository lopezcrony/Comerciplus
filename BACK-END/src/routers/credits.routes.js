const { Router } = require("express");
const creditController = require("../controllers/credits.controller");

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/', creditController.getAllCredits)
    .get('/:id', creditController.getOneCredit)
    .get('/historialcliente/:id', creditController.getCreditHistoryByClient)
    .post('/', authenticateJWT, checkPermission('Crear Crédito'), creditController.createCredit)
    .patch('/:id', creditController.updateTotalCredit)
    .delete('/:id', creditController.deleteOneCredit)

module.exports = router;
