const { body, validationResult } = require('express-validator');

const validateShoppingDetail = [
    body('codigoBarra')
        .notEmpty().withMessage('Se requiere el código de barras')
        .isString().withMessage('El código de barras debe ser una cadena de carácteres'),

    body('cantidadProducto')
        .notEmpty().withMessage('La cantidad de producto es obligatoria')
        .isInt({ gt: 0 }).withMessage('La cantidad de producto debe ser un número entero positivo'),

    body('precioCompraUnidad')
        .notEmpty().withMessage('El precio de compra por unidad es obligatorio')
        .isFloat({ gt: 0 }).withMessage('El precio de compra por unidad debe ser un número positivo'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateShoppingDetail,
};
