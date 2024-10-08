const express = require('express');
const router = express.Router();
const recoverController = require('../controllers/recover.controller');

// Ruta para solicitar el restablecimiento de contraseña
router.post('', recoverController.resetPassword);

module.exports = router;