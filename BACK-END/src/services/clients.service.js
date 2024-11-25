const clientRepository = require('../repositories/clients.repository');
const creditRepository = require('../repositories/credits.repository'); 

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
        const newClient = await clientRepository.createClient(ClientData);
        
        // Le crea un crédito a ese cliente
        const creditData = {
            idCliente: newClient.idCliente, 
            totalCredito: 0 
        };
        await creditRepository.createCredit(creditData);

        return newClient;
    } catch (error) {
        if (error.message.includes('cedulaCliente')) {
            throw new Error('Ya existe un cliente con esa cédula.');
        }
        throw error;
    }
};

const updateClient = async (id, ClientData) => {
    try {
        const result = await clientRepository.updateClient(id, ClientData);
        if (!result) {
            throw new Error('No se pudo actualizar la información del cliente.');
        }
    } catch (error) {
        if (error.message.includes('cedulaCliente')) {
            throw new Error('Ya existe un cliente con esa cédula.');
        }
        throw error;
    }
};

const updateClientStatus  = async (id, status) => {
    try {
        const result = await clientRepository.updateClientStatus(id, status);
        if (!result) {
            throw new Error('No se pudo actualizar el estado del cliente');
        }
        return result;
    } catch (error) {
        throw new Error('Error al cambiar el estado del cliente: ' + error.message);
    }
}


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
    updateClientStatus,
    deleteOneClient
};
