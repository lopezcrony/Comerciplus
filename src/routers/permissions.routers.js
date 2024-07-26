const express = require('express');
const router = express.Router();
const { GetAllPermissions, GetOnePermissions, CreateNewPermission, UpdatePermission , DeleteOnePermission} = require('../controllers/permissions.controllers');

router
    .get('/', GetAllPermissions)
    .get('/:id', GetOnePermissions)
    .post('/', CreateNewPermission)
    .put('/:id', UpdatePermission)
    .delete('/:id', DeleteOnePermission)

module.exports = router;