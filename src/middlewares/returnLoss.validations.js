const { body, validationResult } = require('express-validator');

// Validaciones para el modelo returnLoss
const validateReturnLoss = [
    body('idCodigoBarra')
        .notEmpty().withMessage('El id del código de barra es obligatorio')
        .isInt({ min: 1 }).withMessage('El id del código de barra debe ser un número entero positivo'),

    body('cantidad')
        .notEmpty().withMessage('La cantidad es obligatoria')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor o igual a 1'),

    body('fechaDeBaja')
        .notEmpty().withMessage('La fecha de baja es obligatoria')
        .isISO8601().withMessage('La fecha de baja debe ser una fecha válida en formato ISO 8601'),

    body('motivo')
        .notEmpty().withMessage('El motivo de la baja es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El motivo solo debe contener letras y espacios'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateReturnLoss
};
