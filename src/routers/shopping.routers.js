const { Router } = require("express");
const shoppingController = require("../controllers/shopping.controllers");
const { validateShopping } = require("../middlewares/shopping.validations.");

const router = Router();

router
    .get('/', shoppingController.getAllShoppings)
    .get('/:id', shoppingController.getOneShopping)
    .post('/', validateShopping, shoppingController.createShopping)
    .put('/:id', validateShopping, shoppingController.updateShopping)
    .patch('/:id', shoppingController.updateShoppingStatus)
    .delete('/:id', shoppingController.deleteOneShopping)

module.exports = router;
