const { body, validationResult } = require('express-validator');

// Validaciones para el modelo returnSales
const validateReturnSales = [
    body('idDetalleVenta')
        .notEmpty().withMessage('El id del detalle de venta es obligatorio')
        .isInt({ min: 1 }).withMessage('El id del detalle de venta debe ser un número entero positivo'),

    body('idCodigoBarra')
        .notEmpty().withMessage('El id del código de barra es obligatorio')
        .isInt({ min: 1 }).withMessage('El id del código de barra debe ser un número entero positivo'),

    body('cantidad')
        .notEmpty().withMessage('La cantidad es obligatoria')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor o igual a 1'),

    body('fechaDevolucion')
        .notEmpty().withMessage('La fecha de devolución es obligatoria')
        .isISO8601().withMessage('La fecha de devolución debe ser una fecha válida en formato ISO 8601'),

    body('motivoDevolucion')
        .notEmpty().withMessage('El motivo de la devolución es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El motivo de la devolución solo debe contener letras y espacios'),

    body('tipoReembolso')
        .notEmpty().withMessage('El tipo de reembolso es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El tipo de reembolso solo debe contener letras y espacios'),

    body('valorDevolucion')
        .notEmpty().withMessage('El valor de la devolución es obligatorio')
        .isFloat({ min: 0 }).withMessage('El valor de la devolución debe ser un número mayor o igual a 0'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateReturnSales
};
