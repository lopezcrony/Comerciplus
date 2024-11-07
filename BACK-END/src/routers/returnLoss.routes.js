const { Router } = require("express");
const returnLossController = require("../controllers/returnLoss.controller");
const {validateReturnLoss} = require("../middlewares/returnLoss.validations");

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/', returnLossController.GetAllReturnLoss)
    .get('/:id', returnLossController.GetOneReturnLoss)
    .post('/',validateReturnLoss, authenticateJWT, checkPermission('Crear Devolución'), returnLossController.CreateNewReturnLoss)

module.exports = router;
