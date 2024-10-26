const express = require('express');
const router = express.Router();
const PermissionController = require('../controllers/permissions.controller');

router
    .get('/', PermissionController.getAllPermissions) // Define la ruta para obtener permisos
    .get('/:idRol', PermissionController.getPermissionsByRole); // Define la ruta para obtener permisos por rol
    
module.exports = router;
