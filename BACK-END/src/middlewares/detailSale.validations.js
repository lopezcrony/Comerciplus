const { body, validationResult } = require('express-validator');

// Validaciones para el modelo detalleVenta
const validateDetalleVenta = [
    body('idVenta')
        .notEmpty().withMessage('El id de la venta es obligatorio')
        .isInt({ min: 1 }).withMessage('El id de la venta debe ser un número entero positivo'),

    body('idProducto')
        .notEmpty().withMessage('El producto es obligatorio'),

    body('cantidadProducto')
        .notEmpty().withMessage('La cantidad de producto es obligatoria')
        .isInt({ min: 1 }).withMessage('La cantidad de producto debe ser un número entero mayor o igual a 1'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("se daño esta vuelta");
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateDetalleVenta
};
