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

    body('numeroFactura')
        .notEmpty().withMessage('El número de factura es obligatorio')
        .isString().withMessage('El número de factura debe ser una cadena de caracteres')
        .isLength({ max: 50 }).withMessage('El número de factura no debe exceder los 50 caracteres'), // Adicional para limitar longitud

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
