const { Router } = require("express");
const productsController = require("../controllers/products.controllers");
const { validateProducts } = require("../middlewares/products.validations");

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/', productsController.getAllProducts)
    .get('/:id', productsController.getOneProduct)
    .post('/', validateProducts, authenticateJWT, checkPermission('Crear Producto'), productsController.createProduct)
    .put('/:id', validateProducts, authenticateJWT, checkPermission('Editar Producto'), productsController.updateProduct)
    .patch('/:id', authenticateJWT, checkPermission('Cambiar Estado Producto'), productsController.updateProductStatus)
    .delete('/:id', authenticateJWT, checkPermission('Eliminar Producto'), productsController.deleteOneProduct)

module.exports = router;
