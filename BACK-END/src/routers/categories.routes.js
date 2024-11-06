const { Router } = require("express");
const categorieController = require("../controllers/categories.controllers");
const { validateCategorie } = require("../middlewares/categories.validations");

const { authenticateJWT } = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/checkPermission');


const router = Router();

router
    .get('/', categorieController.getAllCategories)
    .get('/:id', categorieController.getOneCategorie)
    .post('/', validateCategorie, authenticateJWT, checkPermission('Crear Categoría'), categorieController.createCategorie)
    .put('/:id', validateCategorie, authenticateJWT, checkPermission('Editar Categoría'), categorieController.updateCategorie)
    .patch('/:id', authenticateJWT, checkPermission('Cambiar Estado Categoría'), categorieController.updateCategorieStatus)
    .delete('/:id', authenticateJWT, checkPermission('Eliminar Categoría'), categorieController.deleteOneCategorie)

module.exports = router;
