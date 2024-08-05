const { Router } = require("express");
const rolesController = require("../controllers/roles.controller");
const { validateRoles } = require('../middlewares/roles.validations')

const router = Router();

router
    .get('/', rolesController.getAllRoles)
    .get('/:id', rolesController.getOneRol)
    .post('/', validateRoles, rolesController.createNewRol)
    .put('/:id', validateRoles, rolesController.updateRol)
    .delete('/:id', rolesController.deleteOneRol)


module.exports = router;
