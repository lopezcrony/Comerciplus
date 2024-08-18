const { Router } = require("express");
const detailCreditController = require("../controllers/detailCredit.controller");

const router = Router();

router
    .get('/:idCredito', detailCreditController.getAllDetailCredit)
    .post('/', detailCreditController.addVentaToCredito)
    .delete('/:id', detailCreditController.deleteDetailCredit)

module.exports = router;