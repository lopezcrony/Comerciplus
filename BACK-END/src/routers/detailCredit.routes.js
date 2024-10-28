const { Router } = require("express");
const detailCreditController = require("../controllers/detailCredit.controller");

const router = Router();

router
    .get('/:idCredito', detailCreditController.getAllDetailCredit)
    .post('/', detailCreditController.addSaleToCredit)
    .delete('/:id', detailCreditController.deleteDetailCredit)

module.exports = router;