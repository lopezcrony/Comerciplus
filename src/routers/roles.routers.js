const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

router.get('/', rolesController.getAllRoles);
router.get('/:id', rolesController.getOneRoles);
router.post('/', rolesController.CreateNewRol);
router.put('/:id', rolesController.UpdateRol);
router.delete('/:id', rolesController.deleteOneRol);

module.exports = router;
