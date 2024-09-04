const { Router } = require("express");
const productsController = require("../controllers/products.controllers");


const existeProductoPorId = async(id)=>{


    const existeProducto= await productsController.getOneProduct(id);
    if (!existeProducto) {
        throw new Error(`el producto no existe ${id}`);
        
    }
}

// validar colecciones permitidas

const coleccionesPermitidas=(coleccion = '', colecciones = [])=>{
    
    const incluida= colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`la coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    
    return true;
}


module.exports={
    existeProductoPorId,
    coleccionesPermitidas,
}