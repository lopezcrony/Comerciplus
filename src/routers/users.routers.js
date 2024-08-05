const { Router } = require("express");
const userController = require("../controllers/users.controllers");
const { validateUsers } = require('../middlewares/users.validations')

const router = Router();

router
    .get('/', userController.GetAllUsers)
    .get('/:id', userController.GetOneUsers)
    .post('/', validateUsers, userController.CreateNewUser)
    .put('/:id', validateUsers, userController.UpdateUser)
    .delete('/:id', userController.DeleteOneUser)


module.exports = router;