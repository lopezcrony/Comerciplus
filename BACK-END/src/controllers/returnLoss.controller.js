const returnLossService = require('../services/returnLoss.service');


const GetAllReturnLoss = async (request, response) => {
    try {
        const sales = await returnLossService.getAllReturnLoss();
        response.json(sales);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};

const GetOneReturnLoss = async (req, res) => {
    try {
        const sales = await returnLossService.getOneReturnLoss(req.params.id);
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const CreateNewReturnLoss = async (req, res) => {
    try {
        const newSale = await returnLossService.createReturnLoss(req.body);
        res.status(201).json({ message: 'Devolución de venta creada exitosamente.', newSale });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    GetAllReturnLoss,
    GetOneReturnLoss,
    CreateNewReturnLoss,
}
