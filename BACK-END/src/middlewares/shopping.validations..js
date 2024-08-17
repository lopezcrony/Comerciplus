const { body, validationResult } = require('express-validator');
const moment = require('moment');

const validateShopping = [
    body('fechaCompra')
        .notEmpty().withMessage('La fecha de compra es obligatoria')
        .custom(value => {
            if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
                throw new Error('La fecha de compra debe ser válida y en formato YYYY-MM-DD');
            }
            return true;
        }),

    body('fechaRegistro')
        .notEmpty().withMessage('La fecha de registro es obligatoria')
        .custom(value => {
            if (!moment(value, moment.ISO_8601, true).isValid()) {
                throw new Error('La fecha de registro debe ser una marca de tiempo válida');
            }
            return true;
        }),

    body('numeroFactura')
        .notEmpty().withMessage('El número de factura es obligatorio')
        .isString().withMessage('El número de factura debe ser una cadena de caracteres'),

    body('valorCompra')
        .notEmpty().withMessage('El valor de compra es obligatorio')
        .isFloat({ gt: 0 }).withMessage('El valor de compra debe ser un número positivo'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateShopping
};
