const clientRepository = require('../repositories/clients.repository');

const getAllClients = async () => {
    try {
        return await clientRepository.findAllClients();
    } catch (error) {
        throw error;
    }
};


const getOneClient = async (id) => {
    try {
        return await clientRepository.findClientById(id);
    } catch (error) {
        throw error;
    }
};

const createClient = async (ClientData) => {
    try {
        return await clientRepository.createClient(ClientData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe un cliente con esa información.');
        }
        throw error;
    }
};

const updateClient = async (id, ClientData) => {
    try {
        const Client = await clientRepository.findClientById(id);
        if (Client) {
            return await clientRepository.updateClient(id, ClientData);
        }
        throw new Error('Cliente no encontrado');
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('La cédula del cliente ya está registrada.');
        }
        throw error;
    }
};

const deleteOneClient = async (id) => {
    try {
        const result = await clientRepository.deleteClient(id);
        if (result === 0) {
            throw new Error('Cliente no encontrado');
        }
        return result;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getAllClients,
    getOneClient,
    createClient,
    updateClient,
    deleteOneClient,
};
