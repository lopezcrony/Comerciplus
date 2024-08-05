const { body, validationResult } = require('express-validator');

const validatePermission = [
    
    body('nombrePermiso')
        .notEmpty().withMessage('El nombre del permiso es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El nombre del permiso contiene carácteres no válidos'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validatePermission
};
