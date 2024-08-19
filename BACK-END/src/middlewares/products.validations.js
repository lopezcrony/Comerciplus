const { body, validationResult } = require('express-validator');

const validateProducts = [
    body('nombreProducto')
        .notEmpty().withMessage('el nombre del producto es obligatoria')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('Los caracteres no son validos'),

    body('stock')
        .notEmpty().withMessage('El stock es obligatorio')
        .matches('^[0-9]+$').withMessage('Solo son validos numeros'),
        
    body('precioVenta')
        .notEmpty().withMessage('El precio venta es obligatorio')
        .matches('^(|[1-9][0-9]*)(\\.[0-9]+)?$').withMessage('Solo son validos numeros'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateProducts
};
