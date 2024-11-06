const { Router } = require("express");
const returnProviderController = require ("../controllers/returnProvider.controller");
const {validateReturnProvider} = require ("../middlewares/returnProvider.validations");

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/', returnProviderController.GetAllreturnProvider)
    .get('/:id', returnProviderController.GetOnereturnProvider)
    .post('/',validateReturnProvider, authenticateJWT, checkPermission('Crear Devolución'), returnProviderController.CreateNewreturnProvider)
    .patch('/:id', authenticateJWT, checkPermission('Cambiar Estado Devolución'), returnProviderController.updateSalereturnProviderStatus)    

module.exports = router;
