const { Router } = require("express");
const { cargarImg } = require("../controllers/uploads");

const router = Router();

router
    .post('/',cargarImg)

module.exports = router;
 