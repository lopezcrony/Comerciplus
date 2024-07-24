const { Router } = require("express");
const { GetAllCategoriesController, GetOneCategorieController, CreateNewCategorieController, UpdateCategorieController, DeleteOneCategoriesController } = require("../controllers/categories.controllers");
const { validateCategorie } = require("../validations/categories.validations");

const router = Router();

router
    .get('/', GetAllCategoriesController)
    .get('/:id', GetOneCategorieController)
    .post('/', validateCategorie, CreateNewCategorieController)
    .put('/:id', validateCategorie, UpdateCategorieController)
    .delete('/:id', DeleteOneCategoriesController)
    module.exports = router;
