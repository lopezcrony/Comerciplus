const { response } = require('express');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
const { subirimagen } = require('../helpers/subirarchivos');
const Producto = require('../models/products.model'); // Importa el modelo correctamente

const cargarImagen = async (req, res = response) => {
    const { coleccion } = req.params;
    try {
        const nombre = await subirimagen(req.files, undefined, coleccion);
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
                return res.status(400).json({ msg: `No existe un producto con ese ID: ${id}` });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    //limpiar imagenes
    if (modelo.imagenProducto) {
        // borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.imagenProducto);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirimagen(req.files, undefined, coleccion);
    modelo.imagenProducto = nombre;
 
    await modelo.save();

    res.json(modelo);
}


const actualizarimagenClaudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'productos':
            modelo = await Producto.findByPk(id); // Cambiar findById a findByPk
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con ese ID: ${id}` });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    //limpiar imagenes
    if (modelo.imagenProducto) {
        const nombreArr = modelo.imagenProducto.split('/');
        const nombre = nombreArr[nombreArr.length-1];
        const [public_id] = nombre.split('.'); 
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.img;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

    // const nombre = await subirimagen(req.files, undefined, coleccion);
    modelo.imagenProducto = secure_url;
 
    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'productos':
            modelo = await Producto.findByPk(id); // Cambiar findById a findByPk
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el ID ${id}` });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    // Verificar si existe una imagen en el modelo
    if (modelo.imagenProducto) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.imagenProducto);

        // Verificar si la imagen existe en el servidor
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    // Si no hay imagen, responder con un mensaje o una imagen por defecto
    const pathImagenDefault = path.join(__dirname, '../assets/no-image.jpg'); // Cambia la ruta a donde está tu imagen por defecto
    return res.sendFile(pathImagenDefault);
};

module.exports = {
    cargarImagen,
    actualizarimagen,
    mostrarImagen,
    actualizarimagenClaudinary
}
