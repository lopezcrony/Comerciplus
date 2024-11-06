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
        const { sale, saleDetail } = req.body;

        if (!saleDetail || saleDetail.length === 0) {
            return res.status(400).json({ message: 'Debe agregar mínimo un producto' });
        }
        const newSale = await saleService.createSale(sale, saleDetail);
        res.status(201).json({ message: 'Venta creada exitosamente.', newSale });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear la venta.', error: error.message });
    }
};

const cancelSale = async (req, res) => {
    try {
        const { id } = req.params;
        await saleService.cancelSale(id);
        res.status(200).json({ message: 'Venta anulada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al anular la venta', error: error.message });
    }
};

const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await saleService.deleteSale(id);
        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error al eliminar la venta:', error);
        res.status(500).json({
            message: 'Error al eliminar la venta',
            error: error.message
        });
    }
};

module.exports = {
    GetAllSales,
    GetOneSale,
    CreateNewSale,
    cancelSale,
    deleteSale
}
