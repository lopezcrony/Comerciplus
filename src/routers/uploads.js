const { Router } = require("express");
const { check } = require('express-validator');
const { validarCampos,validarArchivo} = require('../helpers');

const { cargarImagen, actualizarimagen } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers/db-validators");

const router = Router();

router
    .post('/',validarArchivo,cargarImagen)
    .put('/:coleccion/:id', [
        validarArchivo,
        check('id', 'El id debe ser un número entero').isInt(),
        check('coleccion').custom(c => coleccionesPermitidas(c, ['productos'])),
        validarCampos
    ], actualizarimagen)

module.exports = router;
