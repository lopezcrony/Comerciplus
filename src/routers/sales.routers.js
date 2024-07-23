const { Router } = require("express");
const { GetAllSales, GetOneSale, CreateNewSale, DeleteOneSale } = require("../controllers/sales.controller");

const router = Router();

router
    .get('/', GetAllSales)
    .get('/:id', GetOneSale)
    .post('/', CreateNewSale)
    .delete('/:id', DeleteOneSale)

module.exports = router;
