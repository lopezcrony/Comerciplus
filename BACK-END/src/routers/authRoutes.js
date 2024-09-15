const { Router } = require('express');
const { loginUser, logoutUser } = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/auth.middleware');

const router = Router();

console.log('Auth routes loaded'); // Mensaje para verificar carga de rutas

// Ruta para iniciar sesión
router.post('/', loginUser) 
// Ruta para cerrar sesión
router.post('/logout', authenticateJWT, logoutUser);

module.exports = router;
