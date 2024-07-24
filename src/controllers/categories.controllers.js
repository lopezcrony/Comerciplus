const { request, response } = require('express')
const { GetAllCategoriesService, GetOneCategorieService, CreateNewCategorieService, updateOneCategorieService, deleteOneCategorieService } = require('../services/categories.service');

const GetAllCategoriesController = async (request, response) => {
    try {
        const categories = await GetAllCategoriesService();
        response.json(categories);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener las categorias', error });
    }
};

const GetOneCategorieController = async (request, response) => {
    try {
        const { id } = request.params
        const categorie = await GetOneCategorieService(id);

        if (categorie) {
            response.json(categorie);
        } else {
            response.status(404).json({ message: 'Categoría no encontrada' })
        }
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener la categoría', error: error.message });
    }
};

const CreateNewCategorieController = async (request, response) => {
    try {
        const { nombreCategoria, descripcionCategoria } = request.body;

        const newCategorie = {
            nombreCategoria,
            descripcionCategoria
        };

        const result = await CreateNewCategorieService(newCategorie);
        response.status(201).json({ message: 'Categoria creada exitosamente.' });

    } catch (error) {
        response.status(500).json({ message: 'Error al crear la categoria.', error: error.message });
    }
};

const UpdateCategorieController = async (request, response) => {
    try {
        const { id } = request.params;
        const { nombreCategoria, descripcionCategoria } = request.body;

        const categorie = await GetOneCategorieService(id);
        if(!categorie){
            return response.status(404).json({ message: 'Categoria no encontrada' });
        }

        const updatedCategorie = {
            idCategoria: id,
            nombreCategoria,
            descripcionCategoria,
        };

        const result = await updateOneCategorieService(updatedCategorie);

        response.status(200).json({ message: 'Categoría actualizada exitosamente'});

    } catch (error) {
        response.status(500).json({ message: 'Error al actualizar la categoría.', error: error.message });
    }
};

const DeleteOneCategoriesController = async (request, response) => {
    try {
        const { id } = request.params
        const result = await deleteOneCategorieService(id);

        // Verifica si se eliminó algún registro
        if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Categoría no encontrada.' });
        }
        response.status(200).json({ message: 'Categoría eliminada con éxito.' });
        
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener la Categoría', error: error.message });
    }
}

module.exports = {
    GetAllCategoriesController,
    GetOneCategorieController,
    CreateNewCategorieController,
    UpdateCategorieController,
    DeleteOneCategoriesController
}