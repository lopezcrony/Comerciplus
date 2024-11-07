const { Router } = require("express");

const informeController = require('../controllers/dashboard.controller');

const router = Router();

// Ruta para generar el informe diario
router
    .get('/informe-diario', informeController.getDailyReport);

module.exports = router;
