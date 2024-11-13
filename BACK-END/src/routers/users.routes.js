const { Router } = require("express");
const userController = require("../controllers/users.controllers");
const { validateCreateUser, validateUpdateUser } = require('../middlewares/users.validations');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/', userController.getAllUsers)
    .get('/:id', userController.getOneUser)
    .post('/', validateCreateUser, authenticateJWT, checkPermission('Crear Usuario'), userController.createNewUser)
    .put('/:id', validateUpdateUser, authenticateJWT, checkPermission('Editar Usuario'), userController.updateOneUser)
    .patch('/:id', authenticateJWT, checkPermission('Cambiar Estado Usuario'), userController.updateUserStatus)
    .delete('/:id', authenticateJWT, checkPermission('Eliminar Usuario'), userController.deleteOneUser); // Para protejer el metodo agrego lo siguiente: authenticateJWT

module.exports = router;