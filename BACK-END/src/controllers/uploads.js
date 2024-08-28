const { response } = require('express');
const path = require('path');
const fs = require('fs');

const { subirimagen } = require('../helpers/subirarchivos');
const Producto = require('../models/products.model'); // Importa el modelo correctamente

const cargarImagen = async (req, res = response) => {
    try {
        const nombre = await subirimagen(req.files, undefined, 'imgs');
        res.json({ nombre });
    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const actualizarimagen = async (req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'productos':
            modelo = await Producto.findByPk(id); // Cambiar findById a findByPk
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con ese ID ${id}` });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    //limpiar imagenes
    if (modelo.imagenProducto) {
        //borrar la imagen del servidor
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.imagenProducto);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }
    const nombre = await subirimagen(req.files, undefined, coleccion);
    modelo.imagenProducto = nombre;
    await modelo.save();
    res.json({ modelo });
}


const mostrarImagen = async(req, res = response)=>{

    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'productos':
            modelo = await Producto.findByPk(id); // Cambiar findById a findByPk
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con ese ID ${id}` });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    //limpiar imagenes
    if (modelo.imagenProducto) {
        //borrar la imagen del servidor
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.imagenProducto);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }



    const pathImagenError = path.join(__dirname,'../assets/no-image.jpg');
    res.sendFile(pathImagenError);
}

module.exports = {
    cargarImagen,
    actualizarimagen,
    mostrarImagen
}
