const { body, validationResult } = require('express-validator');

// Validaciones para el modelo Sales
const validateSales = [
    body('fechaVenta')
        .notEmpty().withMessage('La fecha de venta es obligatoria')
        .isISO8601().withMessage('La fecha de venta debe ser una fecha válida en formato ISO 8601'),

    body('totalVenta')
        .notEmpty().withMessage('El total de la venta es obligatorio')
        .isFloat({ min: 0 }).withMessage('El total de la venta debe ser un número mayor o igual a 0'),

    body('estadoVenta')
        .isBoolean().withMessage('El estado de la venta debe ser un valor booleano'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateSales
};
