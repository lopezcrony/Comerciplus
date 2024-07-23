const { request, response } = require('express')
const { getAllSales, getOneSale, createNewSale, deleteOneSale } = require('../services/sales.service');


const GetAllSales = async (request, response) => {
    try {
        const sales = await getAllSales();
        response.json(sales);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
    }
};

const GetOneSale = async (request, response) => {
    try {
        // Destructuración para obtener el id de request.params
        const { id } = request.params
        const sales = await getOneSale(id);

        if (sales) {
            response.json(sales);
        } else {
            response.status(404).json({ message: 'Venta no encontrada' })
        }
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener la venta', error: error.message });
    }
};

const CreateNewSale = async (request, response) => {
    try {
        const { fechaVenta, totalVenta, estadoVenta } = request.body;

        const newSale = {
            fechaVenta,
            totalVenta,
            estadoVenta
        };

        const result = await createNewSale(newSale);
        response.status(201).json({ message: 'Ventas registrada exitosamente.' });

    } catch (error) {
        response.status(500).json({ message: 'Error al registrar la venta.', error: error.message });
    }
};

const DeleteOneSale = async (request, response) => {
    try {
        const { id } = request.params
        const result = await deleteOneSale(id);

        // Verifica si se eliminó algún registro
        if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Venta no encontrada.' });
        }
        response.status(200).json({ message: 'Venta eliminada con éxito.' });
        
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener la venta', error: error.message });
    }
}

module.exports = {
    GetAllSales,
    GetOneSale,
    CreateNewSale,
    DeleteOneSale
}
