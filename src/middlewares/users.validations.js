const { body, validationResult } = require('express-validator');

const validateUsers = [
    body('cedulaUsuario')
        .notEmpty().withMessage('La cédula del usuario es obligatoria')
        .isLength({ min: 5, max: 10 }).withMessage('La cédula del usuario debe tener entre 5 y 10 números')
        .matches(/^[0-9]+$/).withMessage('La cédula del usuario solo debe contener números'),
        
    body('nombreUsuario')
        .notEmpty().withMessage('El nombre del usuario es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El nombre del usuario contiene carácteres no válidos'),
    
    body('apellidoUsuario')
        .notEmpty().withMessage('El apellido del usuario es obligatorio')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('El apellido del usuario contiene carácteres no válidos'),
    
    body('telefonoUsuario')
        .notEmpty().withMessage('El telefono del usuario es obligatorio')
        .isLength({ min: 7, max: 10 }).withMessage('El teléfono del usuario debe contener mínimo 7 dígitos y máximo 10')
        .matches(/^[0-9]+$/).withMessage('El teléfono del usuario solo debe contener números'),

    body('correoUsuario')
        .notEmpty().withMessage('El correo del usuario es obligatorio')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage('El correo electrónico debe tener un formato válido'),
    
    body('contraseñaUsuario')
    .notEmpty().withMessage('La contraseña del usuario es obligatoria')
    .isLength({ min: 8, max: 16 }).withMessage('La contraseña debe tener entre 8 y 16 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una letra mayúscula, una minúscula y un número'),



    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateUsers
};
