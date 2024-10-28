const { Router } = require("express");
const productsController = require("../controllers/products.controllers");
const { validateProducts } = require("../middlewares/products.validations");

const router = Router();

router
    .get('/', productsController.getAllProducts)
    .get('/:id', productsController.getOneProduct)
    .post('/', validateProducts, productsController.createProduct)
    .put('/:id', validateProducts, productsController.updateProduct)
    .patch('/:id', productsController.updateProductStatus)
    .delete('/:id', productsController.deleteOneProduct)

module.exports = router;
