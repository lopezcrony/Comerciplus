const { Router } = require("express");
const { GetAllReturnSales, GetOneReturnSales, CreateNewReturnSales, DeleteOneReturnSales } = require("../controllers/returnSales.controller");

const router = Router();

router
    .get('/', GetAllReturnSales)
    .get('/:id', GetOneReturnSales)
    .post('/', CreateNewReturnSales)
    .delete('/:id', DeleteOneReturnSales)

module.exports = router;
