const shoppingDetailService = require('../services/shoppingdetails.service')

const getAllShoppingDetails = async (req, res) => {
    try {
        const shoppingDetail = await shoppingDetailService.getAllShoppingDetails();
        res.status(200).json(shoppingDetail);
    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER: Error al obtener los detalles de la compra', error });
    }
};

const getOneShoppingDetail = async (req, res) => {
    try {
        const shoppingDetail = await shoppingDetailService.getOneShoppingDetail(req.params.id);
        res.status(200).json(shoppingDetail);
    } catch (error) {
        res.status(500).json({message: 'CONTROLLER: Error al obtener el detalle de la compra.', error});
    }
};

const createShoppingDetail = async (req, res) => {
    try {
        const newShoppingDetail = await shoppingDetailService.createShoppingDetail(req.body);
        res.status(201).json({ message: 'Detalle de compra registrada exitosamente.', newShoppingDetail });
    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER', error: error.message });
    }
};

const updateShoppingDetail = async (req, res) => {
    try {
        const updatedShoppingDetail = await shoppingDetailService.updateShoppingDetail(req.params.id, req.body);
        res.status(200).json({ message: 'Detalle de compra actualizada exitosamente', updatedShoppingDetail});
    } catch (error) {
        if (error.message === 'ya existe un detalle de esta compra') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'CONTROLLER:', error: error.message });
        }
    }
};


const deleteOneShoppingDetail = async (req, res) => {
    try {
        const shoppingDetail = await shoppingDetailService.deleteOneShoppingDetail(req.params.id);
        if(shoppingDetail){
        res.json({ message: 'Detalle de compra eliminada con éxito.' });
        }
    } catch (error) {
        res.status(500).json({mensagge : 'CONTROLLER:', error: error.message });
    }
};

module.exports = {
    getAllShoppingDetails,
    getOneShoppingDetail,
    createShoppingDetail,
    updateShoppingDetail,
    deleteOneShoppingDetail,
} 