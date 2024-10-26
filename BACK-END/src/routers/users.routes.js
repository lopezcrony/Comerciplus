const { Router } = require("express");
const userController = require("../controllers/users.controllers");
const { validateUsers } = require('../middlewares/users.validations')

const router = Router();

router
    .get('/', userController.getAllUsers)
    .get('/:id', userController.getOneUser)
    .post('/', validateUsers, userController.createNewUser)
    .put('/:id', validateUsers, userController.updateOneUser)
    .patch('/:id', userController.updateUserStatus)
    .delete('/:id', userController.deleteOneUser); // Para protejer el metodo agrego lo siguiente: authenticateJWT

module.exports = router;