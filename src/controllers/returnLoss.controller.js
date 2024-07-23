const { request, response } = require('express')
const { getAllReturnLoss, getOneReturnLoss, createNewReturnLoss, deleteOneReturnLoss} = require('../services/returnLoss.service');


const GetAllReturnLoss = async (request, response) => {
    try {
        const returnLoss = await getAllReturnLoss();
        response.json(returnLoss);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el registro de perdida', error: error.message });
    }
};

const GetOneReturnLoss = async (request, response) => {
    try {
        // Destructuración para obtener el id de request.params
        const { id } = request.params
        const returLoss = await getOneReturnLoss(id);

        if (returLoss) {
            response.json(returLoss);
        } else {
            response.status(404).json({ message: 'Regitro de pérdida no encontrado' })
        }
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el regitro de pérdida', error: error.message });
    }
};

const CreateNewReturnLoss = async (request, response) => {
    try {
        const { idDevolucionDeBaja, idCodigoBarra, motivo, cantidad, fechaDeBaja } = request.body;

        const newReturnLoss = {
            idDevolucionDeBaja, 
            idCodigoBarra, 
            motivo, 
            cantidad, 
            fechaDeBaja
        };

        const result = await createNewReturnLoss(newReturnLoss);
        response.status(201).json({ message: 'Regitro de pérdida registrado exitosamente.' });

    } catch (error) {
        response.status(500).json({ message: 'Error al registrar la pérdida.', error: error.message });
    }
};

const DeleteOneReturnLoss = async (request, response) => {
    try {
        const { id } = request.params
        const result = await deleteOneReturnLoss(id);

        // Verifica si se eliminó algún registro
        if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Devolución de venta no encontrada.' });
        }
        response.status(200).json({ message: 'Regitro de pérdida eliminado con éxito.' });
        
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el regitro de pérdida', error: error.message });
    }
}

module.exports = {
    GetAllReturnLoss,
    GetOneReturnLoss,
    CreateNewReturnLoss,
    DeleteOneReturnLoss
}
