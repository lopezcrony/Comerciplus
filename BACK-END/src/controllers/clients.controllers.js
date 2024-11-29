const clientService = require('../services/clients.service')

const getAllClients = async (req, res) => {
    try {
        const clients = await clientService.getAllClients();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOneClient = async (req, res) => {
    try {
        const client = await clientService.getOneClient(req.params.id);
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createClient = async (req, res) => {
    try {
        const newClient = await clientService.createClient(req.body);
        res.status(201).json({ message: 'Cliente registrado exitosamente.', newClient });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const updatedClient = await clientService.updateClient(req.params.id, req.body);
        res.status(200).json({ message: 'Cliente actualizado exitosamente', updatedClient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateClientStatus = async (req, res) => {
    try {
        let { estadoCliente } = req.body;

        if (estadoCliente === '0' || estadoCliente === 0) {
            estadoCliente = false;
        } else if (estadoCliente === '1' || estadoCliente === 1) {
            estadoCliente = true;
        } else if (estadoCliente === true || estadoCliente === false) {

        } else {
            return res.status(400).json({ message: 'El estado debe ser un valor booleano' });
        }
        await clientService.updateClientStatus(req.params.id, estadoCliente);
        res.json({ message: 'Estado actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOneClient = async (req, res) => {
    try {
        const client = await clientService.deleteOneClient(req.params.id);
        if (client) {
            res.json({ message: 'Cliente eliminado con éxito.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllClients,
    getOneClient,
    createClient,
    updateClient,
    updateClientStatus,
    deleteOneClient
}