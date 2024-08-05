const { Router } = require("express");
const returnProviderController = require("../controllers/returnProvider.controller");

const router = Router();

router
    .get('/', returnProviderController.GetAllreturnProvider)
    .get('/:id', returnProviderController.GetOnereturnProvider)
    .post('/', returnProviderController.CreateNewreturnProvider)
    .patch('/:id', returnProviderController.updateSalereturnProviderStatus)    

module.exports = router;
