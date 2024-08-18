const { Router } = require("express");
const permissionsRolesController = require("../controllers/permissionsRoles.controllers");

const router = Router();

router
    .get('/', permissionsRolesController.getAllPermissionsRoles)
    .get('/:id', permissionsRolesController.getOnePermissionRole)
    .post('/', permissionsRolesController.createPermissionRole)
    .put('/:id', permissionsRolesController.updatePermissionRole)
    .delete('/:id', permissionsRolesController.deleteOnePermissionRole)

module.exports = router;
