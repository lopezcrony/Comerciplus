const { Router } = require("express");
const clientController = require("../controllers/clients.controllers");
const { validateClient } = require("../middlewares/clients.validations");

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/', clientController.getAllClients)
    .get('/:id', clientController.getOneClient)
    .post('/', validateClient, authenticateJWT, checkPermission('Crear Cliente'), clientController.createClient)
    .put('/:id', validateClient, authenticateJWT, checkPermission('Editar cliente'), clientController.updateClient)
    .patch('/:id', authenticateJWT, checkPermission('Cambiar Estado Cliente'), clientController.updateClientStatus)
    .delete('/:id', clientController.deleteOneClient)

module.exports = router;
