const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirimagen = (files, extensionevalidas = ['jpg', 'jpeg', 'png', 'bmp', 'tif', 'tiff', 'svg', 'webp','jfif'], carpeta = 'productos') => {

    return new Promise((resolve, reject) => {
        

        const { img } = files;
        const nombrecorto = img.name.split('.');
        const extension = nombrecorto[nombrecorto.length - 1];

        //validar extensiones
        if (!extensionevalidas.includes(extension)) {
            return reject(`la extension ${extension} no esta disponible, las unicas validas son: ${extensionevalidas}`)
        }

        const nombreimg = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/',carpeta, nombreimg);

        img.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
            resolve(nombreimg);
        });
    }); 
}
 

module.exports={
    subirimagen
}