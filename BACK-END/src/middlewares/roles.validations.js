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

const roles = (req, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({ message: 'Verifying the role is required without validating the token'});
    }

    const { role, name} = req.user;
    if (role !== 'Administrator') {
        return res.status(401).json({ message: `${name} You are not an administrator - you can't do that` })
    }
    next();
};

const haveRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({ message: 'It is required to verify the role without validating the token'});
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({ message: `The service requires one of these roles: ${roles}` });
        }
        console.log(roles, req.user.role);

        next();
    }

};



module.exports = {
    validateRoles, 
    roles, // verifica si el usuario está autenticado y tiene el rol de "Administrator"
    haveRole // permite verificar si el usuario tiene uno de los roles especificados. 
};
