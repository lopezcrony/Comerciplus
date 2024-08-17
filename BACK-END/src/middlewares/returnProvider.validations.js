const { body, validationResult } = require('express-validator');

// Validaciones para el modelo returnProvider
const validateReturnProvider = [
    body('idProveedor')
        .notEmpty().withMessage('El id del proveedor es obligatorio')
        .isInt({ min: 1 }).withMessage('El id del proveedor debe ser un número entero positivo'),

    body('idCodigoBarra')
        .notEmpty().withMessage('El id del código de barra es obligatorio')
        .isInt({ min: 1 }).withMessage('El id del código de barra debe ser un número entero positivo'),

    body('cantidad')
        .notEmpty().withMessage('La cantidad es obligatoria')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor o igual a 1'),

    body('motivoDevolucion')
        .notEmpty().withMessage('El motivo de la devolución es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El motivo de la devolución solo debe contener letras y espacios'),

    body('estado')
        .notEmpty().withMessage('El estado es obligatorio')
        .isIn(['Por notificar', 'Notificado', 'En proceso', 'Finalizado']).withMessage('El estado debe ser uno de los siguientes valores: Por notificar, Notificado, En proceso, Finalizado'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateReturnProvider
};
