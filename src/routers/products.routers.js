const { Router } = require("express");
const { GetAllProductsController, GetOneProductController, CreateNewProductController, UpdateProductController, DeleteOneProductController } = require("../controllers/products.controllers");

const router = Router();

router
    .get('/', GetAllProductsController)
    .get('/:id',GetOneProductController)
    .post('/', CreateNewProductController)
    .put('/:id', UpdateProductController)
    .delete('/:id', DeleteOneProductController)
    module.exports = router;
