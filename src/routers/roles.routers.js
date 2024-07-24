const express = require('express');
const router = express.Router();
const { GetAllRoles, GetOneRoles, CreateNewRol, UpdateRol , DeleteOneRol} = require('../controllers/roles.controllers');

router
    .get('/', GetAllRoles)
    .get('/:id', GetOneRoles)
    .post('/', CreateNewRol)
    .put('/:id', UpdateRol)
    .delete('/:id', DeleteOneRol)

module.exports = router;
