const returnProviderService = require('../services/returnProvider.service');


const GetAllreturnProvider = async (request, response) => {
    try {
        const sales = await returnProviderService.getAllReturnProvider();
        response.json(sales);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener las devoluciones po Proveedor', error: error.message });
    }
};

const GetOnereturnProvider = async (req, res) => {
    try {
        const sales = await returnProviderService.getOneReturnProvider(req.params.id);
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la devolución por proveedor', error: error.message });
    }
};

const CreateNewreturnProvider = async (req, res) => {
    try {
        const newSale = await returnProviderService.createReturnProvider(req.body);
        res.status(201).json({ message: 'Venta creada exitosamente.', newSale });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear la devolución por proveedor.', error: error.message });
    }
};

const updateSalereturnProviderStatus  = async (req, res) => {
    try {
        let { estado } = req.body;        
        await returnProviderService.updateReturnProvider(req.params.id, estado);
        res.json({ message: 'Estado actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado de la venta', error: error.message });
    }
};


module.exports = {
    GetAllreturnProvider,
    GetOnereturnProvider,
    CreateNewreturnProvider,
    updateSalereturnProviderStatus    
}
