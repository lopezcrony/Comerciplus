const { Router } = require("express");
const rolesController = require("../controllers/roles.controller");
const { validateRoles } = require('../middlewares/roles.validations')

const router = Router();

router
    .get('/', rolesController.getAllRoles)
    .get('/:id', rolesController.getOneRole)
    .post('/', validateRoles, rolesController.createNewRole)
    .put('/:id', validateRoles, rolesController.updateRole)
    .delete('/:id', rolesController.deleteOneRole)


module.exports = router;
