const { Router } = require("express");
const permissionController = require("../controllers/permissions.controllers");
const { validatePermission } = require('../middlewares/permissions.validations')

const router = Router();

router
    .get('/', permissionController.GetAllPermissions)
    .get('/:id', permissionController.GetOnePermissions)
    .post('/', validatePermission, permissionController.CreateNewPermission)
    .put('/:id', validatePermission, permissionController.UpdatePermission)
    .delete('/:id', permissionController.DeleteOnePermission)


module.exports = router;
