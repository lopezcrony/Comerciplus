const { Router } = require("express");
const { validateRoles } = require('../middlewares/roles.validations');
const rolesController = require("../controllers/roles.controller");

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/', authenticateJWT, rolesController.getAllRoles)
    .get('/:id', authenticateJWT, rolesController.getOneRole)
    .post('/', authenticateJWT, validateRoles, checkPermission('Crear Rol'), rolesController.createNewRole)
    .put('/:id', authenticateJWT, validateRoles, checkPermission('Editar Rol'), rolesController.updateRole)
    .patch('/:id', authenticateJWT, checkPermission('Editar Rol'), rolesController.updateRoleStatus)
    .delete('/:id', authenticateJWT, checkPermission('Eliminar Rol'), rolesController.deleteOneRole)


module.exports = router;
