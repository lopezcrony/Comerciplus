const { Router } = require("express");
const { GetAllProductsController, GetOneProductController, CreateNewProductController, UpdateProductController, DeleteOneProductController } = require("../controllers/products.controllers");
const { validateProducts } = require("../validations/products.validations");
const { validateCategorie } = require("../validations/categories.validations");

const router = Router();

router
    .get('/', GetAllProductsController)
    .get('/:id',GetOneProductController)
    .post('/',validateProducts,CreateNewProductController)
    .put('/:id',validateProducts,UpdateProductController)
    .delete('/:id', DeleteOneProductController)
    module.exports = router;
