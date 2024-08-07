const { Router } = require("express");
const shoppingDetailsController = require("../controllers/shoppingdetails.controllers");
const { validateShoppingDetail } = require("../middlewares/shoppingdetails.validations.js");

const router = Router();

router
    .get('/', shoppingDetailsController.getAllShoppingDetails)
    .get('/:id', shoppingDetailsController.getOneShoppingDetail)
    .post('/', validateShoppingDetail, shoppingDetailsController.createShoppingDetail)
    .put('/:id', validateShoppingDetail, shoppingDetailsController.updateShoppingDetail)
    .delete('/:id', shoppingDetailsController.deleteOneShoppingDetail)

module.exports = router;
