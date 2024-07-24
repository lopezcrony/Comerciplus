const { Router } = require("express");
const { GetAllClients, GetOneClient, DeleteOneClient, UpdatedOneClient, CreateNewClient } = require("../controllers/clients.controllers");
const { validateClient } = require("../validations/clients.validations");

const router = Router();

router
    .get('/', GetAllClients)
    .get('/:id', GetOneClient)
    .post('/', validateClient, CreateNewClient)
    .put('/:id', validateClient, UpdatedOneClient)
    .delete('/:id', DeleteOneClient)

module.exports = router;
