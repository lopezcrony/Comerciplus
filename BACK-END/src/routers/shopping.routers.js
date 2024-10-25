const { Router } = require("express");
const shoppingController = require("../controllers/shopping.controllers");
const { validateShopping } = require("../middlewares/shopping.validations.");

const router = Router();

router
    .get('/', shoppingController.getAllShoppings)
    .get('/:id', shoppingController.getOneShopping)
    .post('/', validateShopping, shoppingController.createShopping)
    .delete('/:id', shoppingController.deleteOneShopping)
    .patch('/:id', shoppingController.updateShoppingStatus)
    // .patch('/:id', shoppingController.cancelShopping)

module.exports = router;
