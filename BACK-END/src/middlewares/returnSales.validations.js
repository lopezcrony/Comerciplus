const { body, validationResult } = require('express-validator');

// Validaciones para el modelo returnSales
const validateReturnSales = [
    
    
    body('cantidad')
        .notEmpty().withMessage('La cantidad es obligatoria')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor o igual a 1'),

    
    body('motivoDevolucion')
        .notEmpty().withMessage('El motivo de la devolución es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El motivo de la devolución solo debe contener letras y espacios'),

    body('tipoReembolso')
        .notEmpty().withMessage('El tipo de reembolso es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El tipo de reembolso solo debe contener letras y espacios'),

    
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
