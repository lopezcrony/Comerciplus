const { Router } = require("express");
const returnProviderController = require ("../controllers/returnProvider.controller");
const {validateReturnProvider} = require ("../middlewares/returnProvider.validations");

const router = Router();

router
    .get('/', returnProviderController.GetAllreturnProvider)
    .get('/:id', returnProviderController.GetOnereturnProvider)
    .post('/',validateReturnProvider, returnProviderController.CreateNewreturnProvider)
    .patch('/:id', returnProviderController.updateSalereturnProviderStatus)    

module.exports = router;
