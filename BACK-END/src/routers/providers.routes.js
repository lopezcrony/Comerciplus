const { Router } = require("express");
const providerController = require("../controllers/providers.controllers");
const { validateProvider } = require('../middlewares/providers.validations')

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/', providerController.getAllProviders)
    .get('/:id', providerController.getOneProvider)
    .post('/', validateProvider, authenticateJWT, checkPermission('Crear Proveedor'), providerController.createProvider)
    .put('/:id', validateProvider, authenticateJWT, checkPermission('Editar Proveedor'), providerController.updateProvider)
    .patch('/:id', authenticateJWT, checkPermission('Cambiar Estado Proveedor'), providerController.updateProviderStatus)
    .delete('/:id', providerController.deleteOneProvider)


module.exports = router;
