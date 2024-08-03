const { Router } = require("express");
const clientController = require("../controllers/clients.controllers");
const { validateClient } = require("../middlewares/clients.validations");

const router = Router();

router
    .get('/', clientController.getAllClients)
    .get('/:id', clientController.getOneClient)
    .post('/', validateClient, clientController.createClient)
    .put('/:id', validateClient, clientController.updateClient)
    .delete('/:id', clientController.deleteOneClient)

module.exports = router;
