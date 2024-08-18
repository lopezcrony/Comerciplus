const { body, validationResult } = require('express-validator');

const validateProvider = [
    body('nitProveedor')
        .notEmpty().withMessage('El NIT del proveedor es obligatorio')
        .matches(/^[0-9]+$/).withMessage('El NIT del proveedor solo debe contener números'),
        
    body('nombreProveedor')
        .notEmpty().withMessage('El nombre del proveedor es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El nombre del proveedor contiene carácteres no válidos'),
    
    body('direccionProveedor')
        .notEmpty().withMessage('La dirección del proveedor es obligatoria'),
    
    body('telefonoProveedor')
        .isLength({ min: 7, max: 10 }).withMessage('El teléfono del proveedor debe contener mínimo 7 dígitos y máximo 10')
        .matches(/^[0-9]+$/).withMessage('El teléfono del proveedor solo debe contener números'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateProvider
};
