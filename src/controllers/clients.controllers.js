const { request, response } = require('express')
const { getAllClients, getOneClient, deleteOneClient, updateOneClient, createNewClient } = require('../services/clients.service')

const GetAllClients = async (request, response) => {
    try {
        const clients = await getAllClients();
        response.json(clients);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener los clientes', error });
    }
};

const GetOneClient = async (request, response) => {
    try {
        const {id} = request.params;
        const client = await getOneClient(id);

        if(client){
            response.json(client);
        }else{
            response.status(404).json({message: 'Cliente no encontrado.'});
        }

    } catch (error) {
        response.status(500).json({message: 'Error al obtener el cliente.', error});
    }
};

const CreateNewClient = async (request, response) => {
    try {
        const { cedulaCliente, nombreCliente, apellidoCliente, direccionCliente, telefonoCliente } = request.body;

        const newClient = {
            cedulaCliente,
            nombreCliente,
            apellidoCliente,
            direccionCliente,
            telefonoCliente
        };

        const result = await createNewClient(newClient);
        response.status(201).json({ message: 'Cliente registrado exitosamente.', client: result });

    } catch (error) {
        response.status(500).json({ message: 'Error al registrar el cliente.', error: error.message });
    }
};

const UpdatedOneClient = async (request, response) => {
    try {
        const { id } = request.params;
        const { cedulaCliente, nombreCliente, apellidoCliente, direccionCliente, telefonoCliente } = request.body;

        const client = await getOneClient(id);
        if(!client){
            return response.status(404).json({ message: 'Cliente no encontrado' });
        }

        const updatedClient = {
            idCliente: id,
            cedulaCliente,
            nombreCliente,
            apellidoCliente,
            direccionCliente,
            telefonoCliente
        };

        const result = await updateOneClient(updatedClient);

        response.status(200).json({ message: 'Cliente actualizado exitosamente', client: result});
    } catch (error) {
        response.status(500).json({ message: 'Error al actualizar la información del cliente.', error: error.message });
    }
};

const DeleteOneClient = async (request, response) =>{
    try {
        const { id } = request.params;
        const result = await deleteOneClient(id);

        if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Cliente no encontrado.' });
        }
        response.status(200).json({ message: 'Cliente eliminado con éxito.' });
        
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el proveedor', error: error.message });
    }
};

module.exports = {
    GetAllClients,
    GetOneClient,
    CreateNewClient,
    UpdatedOneClient,
    DeleteOneClient
}