const express = require('express');
const router = express.Router();
const { GetAllUsers, GetOneUsers, CreateNewUser, UpdateUser, DeleteOneUser} = require('../controllers/users.controllers');

router
    .get('/', GetAllUsers)
    .get('/:id', GetOneUsers)
    .post('/', CreateNewUser)
    .put('/:id', UpdateUser)
    .delete('/:id', DeleteOneUser)

module.exports = router;
