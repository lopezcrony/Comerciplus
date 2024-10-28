const { Router } = require("express");
const providerController = require("../controllers/providers.controllers");
const { validateProvider } = require('../middlewares/providers.validations')

const router = Router();

router
    .get('/', providerController.getAllProviders)
    .get('/:id', providerController.getOneProvider)
    .post('/', validateProvider, providerController.createProvider)
    .put('/:id', validateProvider, providerController.updateProvider)
    .patch('/:id', providerController.updateProviderStatus)
    .delete('/:id', providerController.deleteOneProvider)


module.exports = router;
