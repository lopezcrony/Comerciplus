const { request, response } = require('express')
const { getAllProviders, getOneProvider, createNewProvider,updateOneProvider, deleteOneProvider } = require('../services/providers.service');


const GetAllProviders = async (request, response) => {
    try {
        const providers = await getAllProviders();
        response.json(providers);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener los proveedores', error: error.message });
    }
};

const GetOneProvider = async (request, response) => {
    try {
        // Destructuración para obtener el id de request.params
        const { id } = request.params
        const proveedor = await getOneProvider(id);

        if (proveedor) {
            response.json(proveedor);
        } else {
            response.status(404).json({ message: 'Proveedor no encontrado' })
        }
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el proveedor', error: error.message });
    }
};

const CreateNewProvider = async (request, response) => {
    try {
        const { nitProveedor, nombreProveedor, direccionProveedor, telefonoProveedor } = request.body;

        const newProvider = {
            nitProveedor,
            nombreProveedor,
            direccionProveedor,
            telefonoProveedor
        };

        const result = await createNewProvider(newProvider);
        response.status(201).json({ message: 'Proveedor creado exitosamente.' });

    } catch (error) {
        response.status(500).json({ message: 'Error al crear el proveedor.', error: error.message });
    }
};

const UpdateProvider = async (request, response) => {
    try {
        const { id } = request.params;
        const { nitProveedor, nombreProveedor, direccionProveedor, telefonoProveedor } = request.body;

        const provider = await getOneProvider(id);
        if(!provider){
            return response.status(404).json({ message: 'Proveedor no encontrado' });
        }

        const updatedProvider = {
            idProveedor: id,
            nitProveedor,
            nombreProveedor,
            direccionProveedor,
            telefonoProveedor
        };

        const result = await updateOneProvider(updatedProvider);

        response.status(200).json({ message: 'Proveedor actualizado exitosamente'});

    } catch (error) {
        response.status(500).json({ message: 'Error al actualizar el proveedor.', error: error.message });
    }
};

const DeleteOneProvider = async (request, response) => {
    try {
        const { id } = request.params
        const result = await deleteOneProvider(id);

        // Verifica si se eliminó algún registro
        if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Proveedor no encontrado.' });
        }
        response.status(200).json({ message: 'Proveedor eliminado con éxito.' });
        
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener el proveedor', error: error.message });
    }
}

module.exports = {
    GetAllProviders,
    GetOneProvider,
    CreateNewProvider,
    UpdateProvider,
    DeleteOneProvider
}
