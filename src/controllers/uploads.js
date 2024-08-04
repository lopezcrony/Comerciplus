const { response } = require('express');
const {subirimagen} = require('../helpers/subirarchivos');

const cargarImg = async (req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.img) {
        res.status(400).json({ msg: 'No hay archivos.' });
        return;
    }
    const nombre = await subirimagen(req.files);

    res.json({nombre});
}

module.exports = {
    cargarImg
}
