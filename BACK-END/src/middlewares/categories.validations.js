const { body, validationResult } = require('express-validator');

const validateCategorie = [
    body('nombreCategoria')
        .notEmpty().withMessage('Se requiere el nombre de la categoria')
        .matches(/^[a-zA-Záéíóúñ ]+$/).withMessage('Los carácteres no son correctos'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { 
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateCategorie,
};
