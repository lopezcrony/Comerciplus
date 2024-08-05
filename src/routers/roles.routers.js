const { Router } = require("express");
const rolesController = require("../controllers/roles.controllers");
const { validateRoles } = require('../middlewares/roles.validations')

const router = Router();

router
    .get('/', rolesController.GetAllRoles)
    .get('/:id', rolesController.GetOneRoles)
    .post('/', validateRoles, rolesController.CreateNewRol)
    .put('/:id', validateRoles, rolesController.UpdateRol)
    .delete('/:id', rolesController.DeleteOneRol)


module.exports = router;
