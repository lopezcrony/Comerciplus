const { Router } = require("express");
const returnLossController = require("../controllers/returnLoss.controller");

const router = Router();

router
    .get('/', returnLossController.GetAllReturnLoss)
    .get('/:id', returnLossController.GetOneReturnLoss)
    .post('/', returnLossController.CreateNewReturnLoss)

module.exports = router;
