const { Router } = require("express");
const shoppingController = require("../controllers/shopping.controllers");
const { validateShopping } = require("../middlewares/shopping.validations.");

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');

const router = Router();

router
    .get('/', shoppingController.getAllShoppings)
    .get('/:id', shoppingController.getOneShopping)
    .post('/', validateShopping, authenticateJWT, checkPermission('Crear Compra'), shoppingController.createShopping)
    .delete('/:id', shoppingController.deleteOneShopping)
    // .patch('/:id', shoppingController.updateShoppingStatus)
    .put('/:id', authenticateJWT, checkPermission('Anular Compra'), shoppingController.cancelShopping)

module.exports = router;
