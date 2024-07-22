const { request, response } = require('express')
const { allClients, oneClient } = require('../services/clients.service')

const GetAllClients = async (request, response) => {
    try {
        const clients = await allClients();
        response.json(clients);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener los clientes', error });
    }
};

const GetOneClient = async (request, response) => {
    try {
        const {id} = request.params;
        const client = await oneClient(id);

        if(client){
            response.json(client);
        }else{
            response.status(404).json({message: 'Cliente no encontrado.'});
        }

    } catch (error) {
        response.status(500).json({message: 'Error al obtener el cliente.', error});
    }
}

module.exports = {
    GetAllClients,
    GetOneClient
}