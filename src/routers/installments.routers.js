const { Router } = require("express");
const installmentController = require("../controllers/installments.controller");

const router = Router();

router
    .get('/:idCredito', installmentController.getInstallmentsByCredit)
    .post('/', installmentController.createInstallment)
    .put('/:id', installmentController.updateInstallment)
    .delete('/:id', installmentController.deleteOneInstallment)

module.exports = router;
