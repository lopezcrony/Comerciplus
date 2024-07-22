const { Router } = require("express");
const { GetAllClients, GetOneClient } = require("../controllers/clients.controllers");

const router = Router();

router
    .get('/', GetAllClients)
    .get('/:id', GetOneClient)


    module.exports = router;
