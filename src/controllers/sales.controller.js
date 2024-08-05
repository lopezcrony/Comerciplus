const saleService = require('../services/sales.service');


const GetAllSales = async (request, response) => {
    try {
        const sales = await saleService.getAllSales();
        response.json(sales);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
    }
};

const GetOneSale = async (req, res) => {
    try {
        const sales = await saleService.getOneSales(req.params.id);
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la venta', error: error.message });
    }
};

const CreateNewSale = async (req, res) => {
    try {
        const newSale = await saleService.createSales(req.body);
        res.status(201).json({ message: 'Venta creada exitosamente.', newSale });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear la venta.', error: error.message });
    }
};
const updateSaleStatus  = async (req, res) => {
    try {
        let { statusSale } = req.body;

        if (statusSale == '0' || statusSale == 0) {
            statusSale = false;
        } else if (statusSale == '1' || statusSale == 1) {
            statusSale = true;
        }else {
            return res.status(400).json({ message: 'El estado debe ser un valor booleano' });
        }
        
        await saleService.updateSalesStatus(req.params.id, statusSale);
        res.json({ message: 'Estado actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado de la venta', error: error.message });
    }
};


module.exports = {
    GetAllSales,
    GetOneSale,
    CreateNewSale,
    updateSaleStatus    
}
