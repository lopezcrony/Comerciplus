const { body, validationResult } = require('express-validator');

const validateRoles = [
    
    body('nombreRol')
        .notEmpty().withMessage('El nombre del rol es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El nombre del rol contiene carácteres no válidos'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateRoles
};
