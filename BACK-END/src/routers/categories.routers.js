const { Router } = require("express");
const categorieController = require("../controllers/categories.controllers");
const { validateCategorie } = require("../middlewares/categories.validations");

const router = Router();

router
    .get('/', categorieController.getAllCategories)
    .get('/:id', categorieController.getOneCategorie)
    .post('/', validateCategorie, categorieController.createCategorie)
    .put('/:id', validateCategorie, categorieController.updateCategorie)
    .patch('/:id', categorieController.updateCategorieStatus)
    .delete('/:id', categorieController.deleteOneCategorie)

module.exports = router;
