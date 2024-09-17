const shoppingService = require('../services/shopping.service')

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

// const createShopping = async (req, res) => {
//     try {
//         const newShopping = await shoppingService.createShopping(req.body);
//         res.status(201).json({ message: 'Compra registrada exitosamente.', newShopping });
//     } catch (error) {
//         res.status(500).json({ message: 'CONTROLLER: Error al crear la compra.', error: error.message});
//     }
// };

const createShopping = async (req, res) => {
    try {
        const { shopping, shoppingDetail } = req.body;

        if (!shoppingDetail || shoppingDetail.length === 0) {
            return res.status(400).json({ message: 'La compra debe tener al menos un detalle de compra.' });
        }

        const newShopping = await shoppingService.createShopping(shopping, shoppingDetail);
        res.status(201).json({ message: 'Compra registrada exitosamente.', newShopping });
    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER: Error al crear la compra.', error: error.message });
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




const updateShoppingStatus  = async (req, res) => {
    try {
        let { estadoCompra } = req.body;

        if (estadoCompra === '0' || estadoCompra === 0) {
            estadoCompra = false;
        } else if (estadoCompra === '1' || estadoCompra === 1) {
            estadoCompra = true;
        } else if (estadoCompra === true || estadoCompra === false) {
            
        } else {
            return res.status(400).json({ message: 'El estado debe ser un valor booleano' });
        }
        await shoppingService.updateShoppingStatus (req.params.id, estadoCompra);
        res.json({ message: 'Estado actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'CONTROLLER:', error: error.message });
    }
};



module.exports = {
    getAllShoppings,
    getOneShopping,
    createShopping,
    deleteOneShopping,
    updateShoppingStatus
}