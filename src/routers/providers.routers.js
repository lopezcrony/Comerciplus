const { Router } = require("express");
const { getAllProviders, getOneProvider, createNewProvider, updateOneProvider, deleteOneProvider } = require("../controllers/providers.controllers");
const { validateProvider } = require('../middlewares/providers.validations')

const router = Router();

router
    .get('/', getAllProviders)
    .get('/:id', getOneProvider)
    .post('/', validateProvider, createNewProvider)
    .put('/:id', validateProvider, updateOneProvider)
    .delete('/:id', deleteOneProvider)


module.exports = router;
