const { Router } = require('express');
const { loginUser } = require('../controllers/authController');

const router = Router();

console.log('Auth routes loaded'); // Mensaje para verificar carga de rutas

// Ruta para iniciar sesión
router.post('/', loginUser) 

module.exports = router;
