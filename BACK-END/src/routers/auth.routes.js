const { Router } = require('express');
const { loginUser, logoutUser } = require('../controllers/auth.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

const router = Router();

router
    .post('/', loginUser) // Ruta para iniciar sesión
    .post('/logout', authenticateJWT, logoutUser) // Ruta para cerrar sesión
    
module.exports = router;
