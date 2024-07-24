const { Router } = require("express");
const { GetAllProviders, GetOneProvider, CreateNewProvider, UpdateProvider, DeleteOneProvider } = require("../controllers/providers.controllers");
const { validateProvider } = require('../validations/providers.validations')

const router = Router();

router
    .get('/', GetAllProviders)
    .get('/:id', GetOneProvider)
    .post('/', validateProvider, CreateNewProvider)
    .put('/:id', validateProvider, UpdateProvider)
    .delete('/:id', DeleteOneProvider)



module.exports = router;
