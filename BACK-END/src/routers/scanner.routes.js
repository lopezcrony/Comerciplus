const { Router } = require("express");
const router = Router();

const scannerController = require('../controllers/scanner.controller');

router
    .post('/', scannerController.scannerController)

module.exports = router;
