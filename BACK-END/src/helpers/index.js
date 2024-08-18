const { validarArchivo } = require('./archivo.validators');
const { existeProductoPorId, coleccionesPermitidas } = require('./db-validators');
const { subirimagen } = require('./subirarchivos');
const { validarCampos } = require('./validar-campos');

module.exports = {
    validarCampos,
    subirimagen,
    existeProductoPorId,
    coleccionesPermitidas,
    validarArchivo
}
