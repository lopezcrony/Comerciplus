const detailSaleService = require('../services/detailSale.service');


const GetAllDetailSales = async (request, response) => {
    try {
        const detailSales = await detailSaleService.getAlldetailSales();
        response.json(detailSales);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener los detalles', error: error.message });
    }
};

const GetOneDetailSales = async (req, res) => {
    try {
        const detailSales = await detailSaleService.getOnedetailSales(req.params.id);
        res.status(200).json(detailSales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el detalle de la venta', error: error.message });
    }
};

// Busca los detalles de venta asociados a una venta en particular
const GetAllDetailsBySale = async (req, res) => {
    try {
        const { idVenta } = req.params;
        const saleDetails = await detailSaleService.getAllDetailsBySale(idVenta);
        if (saleDetails.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos asociadas a esta venta.' });
        }
        return res.status(200).json(saleDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el detalle de la venta', error: error.message });
    }
};

module.exports = {
    GetAllDetailSales,
    GetOneDetailSales,
    GetAllDetailsBySale,
}
