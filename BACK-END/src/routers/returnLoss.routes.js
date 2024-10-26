const { Router } = require("express");
const returnLossController = require("../controllers/returnLoss.controller");
const {validateReturnLoss} = require("../middlewares/returnLoss.validations");

const router = Router();

router
    .get('/', returnLossController.GetAllReturnLoss)
    .get('/:id', returnLossController.GetOneReturnLoss)
    .post('/',validateReturnLoss, returnLossController.CreateNewReturnLoss)

module.exports = router;
