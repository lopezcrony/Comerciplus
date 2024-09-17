const { body, validationResult } = require('express-validator');
const moment = require('moment');

const validateShopping = [
    // Validar campos dentro de 'shopping'
    body('shopping.fechaCompra')
        .notEmpty().withMessage('La fecha de compra es obligatoria')
        .custom(value => {
            if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
                throw new Error('La fecha de compra debe ser válida y en formato YYYY-MM-DD');
            }
            return true;
        }),

    body('shopping.numeroFactura')
        .notEmpty().withMessage('El número de factura es obligatorio')
        .isString().withMessage('El número de factura debe ser una cadena de caracteres')
        .isLength({ max: 50 }).withMessage('El número de factura no debe exceder los 50 caracteres'),

    // Validar el array 'shoppingDetail'
    body('shoppingDetail')
        .isArray().withMessage('Detalles de compra deben ser un array')
        .notEmpty().withMessage('Debe incluir al menos un detalle de compra')
        .custom(details => {
            for (const detail of details) {
                if (!detail.codigoBarra || typeof detail.codigoBarra !== 'string') {
                    throw new Error('El código de barras es obligatorio y debe ser una cadena de caracteres');
                }
                if (!detail.cantidadProducto || !Number.isInteger(detail.cantidadProducto) || detail.cantidadProducto <= 0) {
                    throw new Error('La cantidad de producto es obligatoria y debe ser un número entero positivo');
                }
                if (!detail.precioCompraUnidad || typeof detail.precioCompraUnidad !== 'number' || detail.precioCompraUnidad <= 0) {
                    throw new Error('El precio de compra por unidad es obligatorio y debe ser un número positivo');
                }
            }
            return true;
        }),

    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateShopping
};
