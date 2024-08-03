const clientService = require('../services/clients.service')

const getAllClients = async (req, res) => {
    try {
        const clients = await clientService.getAllClients();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los clientes', error });
    }
};

const getOneClient = async (req, res) => {
    try {
        const client = await clientService.getOneClient(req.params.id);
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener el cliente.', error});
    }
};

const createClient = async (req, res) => {
    try {
        const newClient = await clientService.createClient(req.body);
        res.status(201).json({ message: 'Cliente registrado exitosamente.', newClient });

    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el cliente.', error: error.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const updatedClient = await clientService.updateClient(req.params.id, req.body);
        res.status(200).json({ message: 'Cliente actualizado exitosamente', updatedClient});
    } catch (error) {
        if (error.message === 'La cédula del cliente ya está registrada.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error al actualizar la información del cliente.', error: error.message });
        }
    }
};

const deleteOneClient = async (req, res) => {
    try {
        const client = await clientService.deleteOneClient(req.params.id);
        if(client){
        res.json({ message: 'Cliente eliminado con éxito.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
    }
};

module.exports = {
    getAllClients,
    getOneClient,
    createClient,
    updateClient,
    deleteOneClient
}