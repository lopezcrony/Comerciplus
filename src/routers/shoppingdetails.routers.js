const { Router } = require("express");
const shoppingDetailsController = require("../controllers/shoppingdetails.controllers");
const { validateShoppingDetail } = require("../middlewares/shoppingdetails.validations.js");

const router = Router();

router
    .get('/', shoppingDetailsController.getAllShoppingDetails)
    .get('/:id', shoppingDetailsController.getOneShoppingdetail)
    .post('/', validateShoppingDetail, shoppingDetailsController.createShoppingdetail)
    .put('/:id', validateShoppingDetail, shoppingDetailsController.updateShoppingdetail)
    .delete('/:id', shoppingDetailsController.deleteOneShoppingdetail)

module.exports = router;
