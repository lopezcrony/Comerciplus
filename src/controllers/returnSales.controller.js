const { request, response } = require('express')
const { getAllReturnSales, getOneReturnSales, createNewReturnSales, deleteOneReturnSales } = require('../services/returnSales.Service');


const GetAllReturnSales = async (request, response) => {
    try {
        const returnSales = await getAllReturnSales();
        response.json(returnSales);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener la devolución de venta', error: error.message });
    }
};

const GetOneReturnSales = async (request, response) => {
    try {
        // Destructuración para obtener el id de request.params
        const { id } = request.params
        const returnSales = await getOneReturnSales(id);

        if (returnSales) {
            response.json(returnSales);
        } else {
            response.status(404).json({ message: 'Devolución de venta no encontrada' })
        }
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener la devolución de venta', error: error.message });
    }
};

const CreateNewReturnSales = async (request, response) => {
    try {
        const { idDetalleVenta, idCodigoBarra, cantidad, fechaDevolucion, motivoDevolucion, tipoReembolso, valorDevolucion } = request.body;

        const newReturnSale = {
            idDetalleVenta, 
            idCodigoBarra, 
            cantidad, 
            fechaDevolucion, 
            motivoDevolucion, 
            tipoReembolso, 
            valorDevolucion
        };

        const result = await createNewReturnSales(newReturnSale);
        response.status(201).json({ message: 'Devolución de venta registrada exitosamente.' });

    } catch (error) {
        response.status(500).json({ message: 'Error al registrar la devolución de venta.', error: error.message });
    }
};

const DeleteOneReturnSales = async (request, response) => {
    try {
        const { id } = request.params
        const result = await deleteOneReturnSales(id);

        // Verifica si se eliminó algún registro
        if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Devolución de venta no encontrada.' });
        }
        response.status(200).json({ message: 'Devolución de venta eliminada con éxito.' });
        
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener la devolución de venta', error: error.message });
    }
}

module.exports = {
    GetAllReturnSales,
    GetOneReturnSales,
    CreateNewReturnSales,
    DeleteOneReturnSales
}
