const Client = require('../models/clients.model');

const findAllClients = async () => {
    return await Client.findAll();
};

const findClientById = async (id) => {
    return await Client.findByPk(id);
};

const createClient = async (clientData) => {
    return await Client.create(clientData);
};

const updateClient = async (id, clientData) => {
    const client = await findClientById(id);
    if (client) { return await client.update(clientData); }
    throw new Error('Cliente no encontrado');
};

const updateClientStatus = async (id, status) => {
    const client = await findClientById(id);
    if (client) { return await client.update({ estadoCliente : status }); }
    throw new Error('REPOSITORY: Cliente no encontrado');
};

const deleteClient = async (id) => {
    const result = await Client.destroy({ where: { idCliente: id } });
    return result;
};


module.exports = {
    findAllClients,
    findClientById,
    createClient,
    updateClient,
    updateClientStatus,
    deleteClient,
};
