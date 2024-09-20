const express = require('express');
const router = express.Router();
const restoreController = require('../controllers/restore.controller');

// Ruta para actualizar la contraseña con el token
router.post('', restoreController.resetPasswordWithToken);

module.exports = router;