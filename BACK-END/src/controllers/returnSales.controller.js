const returnSale = require('../services/returnSales.Service');


const GetAllReturnSale = async (request, response) => {
    try {
        const sales = await returnSale.getAllReturnSales();
        response.json(sales);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
    }
};

const GetOneReturnSale = async (req, res) => {
    try {
        const sales = await returnSale.getOneReturnSales(req.params.id);
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la venta', error: error.message });
    }
};

const CreateNewReturnSale = async (req, res) => {
    try {
        const newSale = await returnSale.createReturnSales(req.body);
        res.status(201).json({ message: 'Devolución de venta creada exitosamente.', newSale });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear la venta.', error: error.message });
    }
}

const updateReturnSalesStatus  = async (req, res) => {
    try {
        let { estado } = req.body;

        if (estado === '0' || estado === 0) {
            estado = false;
        } else if (estado === '1' || estado === 1) {
            estado = true;
        } else if (estado === true || estado === false) {
            
        } else {
            return res.status(400).json({ message: 'El estado debe ser un valor booleano' });
        }
        
        await returnSale.updateReturnSalesStatus(req.params.id, estado);
        res.json({ message: 'Estado actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del proveedor', error: error.message });
    }
};


module.exports = {
    GetAllReturnSale,
    GetOneReturnSale,
    CreateNewReturnSale,
    updateReturnSalesStatus
}
