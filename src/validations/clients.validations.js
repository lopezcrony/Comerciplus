const { body, validationResult } = require('express-validator');

const validateClient = [
    body('cedulaCliente')
        .notEmpty().withMessage('La cédula del cliente es obligatoria')
        .matches(/^[0-9]+$/).withMessage('La cédula del cliente solo debe contener números'),

    body('nombreCliente')
        .notEmpty().withMessage('El nombre del cliente es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El nombre del cliente contiene carácteres no válidos'),

    body('apellidoCliente')
        .notEmpty().withMessage('El apellido del cliente es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El apellido del cliente contiene carácteres no válidos'),

    body('direccionCliente')
        .notEmpty().withMessage('La dirección del cliente es obligatoria'),

    body('telefonoCliente')
        .isLength({ min: 7, max: 10 }).withMessage('El teléfono del cliente debe contener mínimo 7 dígitos y máximo 10')
        .matches(/^[0-9]+$/).withMessage('El teléfono del cliente solo debe contener números'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateClient
};
