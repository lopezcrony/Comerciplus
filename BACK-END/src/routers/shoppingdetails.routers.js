const { Router } = require("express");
const shoppingDetailsController = require("../controllers/shoppingdetails.controllers.js");
const { validateShoppingDetail } = require("../middlewares/shoppingdetails.validations.js");

const router = Router();

router
    .get('/:idCompra', shoppingDetailsController.getAllShoppingDetailsByShopping)
    .get('/', shoppingDetailsController.getAllShoppingDetails)
    .get('/:id', shoppingDetailsController.getOneShoppingdetail)
    .post('/', validateShoppingDetail, shoppingDetailsController.createShoppingdetail)
    .put('/:id', validateShoppingDetail, shoppingDetailsController.updateShoppingdetail)
    .delete('/:id', shoppingDetailsController.deleteOneShoppingdetail)

module.exports = router;
