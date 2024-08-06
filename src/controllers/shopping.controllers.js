const shoppingService = require('../services/shopping.service')
const Producto = require('../models/products.model');
const DetalleCompras = require('../models/shoppingdetails.model');

const getAllShoppings = async (req, res) => {
    try {
        const shopping = await shoppingService.getAllShoppings();
        res.status(200).json(shopping);
    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER: Error al obtener las compras', error });
    }
};

const getOneShopping = async (req, res) => {
    try {
        const shopping = await shoppingService.getOneShopping(req.params.id);
        res.status(200).json(shopping);
    } catch (error) {
        res.status(500).json({message: 'CONTROLLER: Error al obtener la compra.', error});
    }
};

const createShopping = async (req, res) => {
    try {
        const newShopping = await shoppingService.createShopping(req.body);
        res.status(201).json({ message: 'Compra registrada exitosamente.', newShopping });
    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER', error: error.message });
    }
};

const updateShopping = async (req, res) => {
    try {
        const updatedShopping = await shoppingService.updateShopping(req.params.id, req.body);
        res.status(200).json({ message: 'Compra actualizada exitosamente', updatedShopping});
    } catch (error) {
        if (error.message === 'El numero de factura de la compra ya está registrado.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'CONTROLLER:', error: error.message });
        }
    }
};

const updateShoppingStatus  = async (req, res) => {
    try {
        let { estadoCompra  } = req.body;

        if (estadoCompra  === '0' || estadoCompra  === 0) {
            estadoCompra  = false;
        } else if (estadoCompra  === '1' || estadoCompra  === 1) {
            estadoCompra  = true;
        } else if (estadoCompra  === true || estadoCompra  === false) {
            
        } else {
            return res.status(400).json({ message: 'El estado debe ser un valor booleano' });
        }
        await shoppingService.updateShoppingStatus (req.params.id, estadoCompra );
        res.json({ message: 'Estado actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER:', error: error.message });
    }
};

const deleteOneShopping = async (req, res) => {
    try {
        const shopping = await shoppingService.deleteOneShopping(req.params.id);
        if(shopping){
        res.json({ message: 'Compra eliminada con éxito.' });
        }
    } catch (error) {
        res.status(500).json({mensagge : 'CONTROLLER:', error: error.message });
    }
};

const createShoppingWithDetails = async (req, res) => {
    const { shoppingData, detailsData } = req.body;

    try {
        const newShopping = await shoppingService.createShoppingWithDetails(shoppingData, detailsData);
        res.status(201).json({ message: 'Compra registrada exitosamente.', newShopping });
    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER', error: error.message });
    }
};

const getCompraById = async (req, res) => {
    const { id } = req.params;
    try {
        const compra = await shoppingService.findByPk(id, {
            include: {
                model: DetalleCompras,
                as: 'detallesCompra'
            }
        });
        if (!compra) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }
        res.json(compra);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = {
    getAllShoppings,
    getOneShopping,
    createShopping,
    updateShopping,
    updateShoppingStatus,
    deleteOneShopping,
    createShoppingWithDetails,
    getCompraById,
    
}