const { Router } = require("express");
const creditController = require("../controllers/credits.controller");

const router = Router();

router
    .get('/', creditController.getAllCredits)
    .get('/:id', creditController.getOneCredit)
    .post('/', creditController.createCredit)
    .patch('/:id', creditController.updateTotalCredit)
    .delete('/:id', creditController.deleteOneCredit)

module.exports = router;
