const detailSaleService = require('../services/detailSale.service');


const GetAllDetailSales = async (request, response) => {
    try {
        const detailSales = await detailSaleService.getAlldetailSales();
        response.json(detailSales);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el detalle de la venta', error: error.message });
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

const CreateNewDetailSale = async (req, res) => {
    try {
        const newSale = await detailSaleService.createdetailSales(req.body);
        res.status(201).json({ message: 'Detalle de venta creado exitosamente.', newSale });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear el detalle de venta.', error: error.message });
    }
};


module.exports = {
    GetAllDetailSales,
    GetOneDetailSales,
    CreateNewDetailSale,
}
