const { body, validationResult } = require('express-validator');

const validateSaleWithDetails = [
    // Validar campos de 'sales' (datos generales de la venta)
    body('sale.fechaVenta')
        .notEmpty().withMessage('La fecha de venta es obligatoria'),

    // Validar el array 'detalleVenta'
    body('detalleVenta')
        .isArray().withMessage('Los detalles de la venta deben ser un array')
        .notEmpty().withMessage('Debe incluir al menos un detalle de venta')
        .custom(detalles => {
            for (const detalle of detalles) {
                if (!detalle.idProducto || !Number.isInteger(detalle.idProducto)) {
                    throw new Error('El ID del producto es obligatorio y debe ser un número entero positivo');
                }
                if (!detalle.cantidadProducto || !Number.isInteger(detalle.cantidadProducto) || detalle.cantidadProducto <= 0) {
                    throw new Error('La cantidad del producto es obligatoria y debe ser mayor a 0.');
                }
            }
            return true;
        }),

    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateSaleWithDetails
};
