const ShoppingdetailService = require('../services/shoppingdetails.service')

const getAllShoppingDetails = async (req, res) => {
    try {
        const shoppingdetail = await ShoppingdetailService.getAllShoppingDetails();
        res.status(200).json(shoppingdetail);
    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER: Error al obtener los detalles de la compra', error });
    }
};

const getOneShoppingdetail = async (req, res) => {
    try {
        const shoppingdetail = await ShoppingdetailService.getOneShoppingDetail(req.params.id);
        res.status(200).json(shoppingdetail);
    } catch (error) {
        res.status(500).json({message: 'CONTROLLER: Error al obtener el detalle de la compra.', error});
    }
};

const createShoppingdetail = async (req, res) => {
    try {
        const newShoppingdetail = await ShoppingdetailService.createShoppingDetail(req.body);
        res.status(201).json({ message: 'Detalle de compra registrada exitosamente.', newShoppingdetail });

    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER no se registro', error: error.message });
    }
};

const updateShoppingdetail = async (req, res) => {
    try {
        const updatedShoppingdetail = await ShoppingdetailService.updateShoppingDetail(req.params.id, req.body);
        res.status(200).json({ message: 'Detalle de compra actualizado exitosamente', updatedShoppingdetail});
    } catch (error) {
        if (error.message === 'El detalle de la categotia ya esta registrada.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'CONTROLLER:', error: error.message });
        }
    }
};



const deleteOneShoppingdetail = async (req, res) => {
    try {
        const shoppingdetail = await ShoppingdetailService.deleteOneShoppingDetail(req.params.id);
        if(shoppingdetail){
        res.json({ message: 'Detalle eliminado con éxito.' });
        }
    } catch (error) {
        res.status(500).json({mensagge : 'CONTROLLER:', error: error.message });
    }
};

module.exports = {
    getAllShoppingDetails,
    getOneShoppingdetail,
    createShoppingdetail,
    updateShoppingdetail,
    deleteOneShoppingdetail,
}