const categorieRepository = require('../repositories/categories.repository');

const getAllCategories = async () => {
    try {
        return await categorieRepository.findAllCategories();
    } catch (error) {
        throw error;
    }
};

const getOneCategorie = async (id) => {
    try {
        return await categorieRepository.findCategorieById(id);
    } catch (error) {
        throw error;
    }
};

const createCategorie = async (CategorieData) => {
    try {
        return await categorieRepository.createCategorie(CategorieData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe una categoria con ese nombre.');
        }
        throw error;
    }
};

const updateCategorie = async (id, CategorieData) => {
    try {
        const result = await categorieRepository.updateCategorie(id, CategorieData);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar la información de la categoría.');
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('La categoría ya esta registrada.');
        }
        throw error;
    }
};

const updateCategorieStatus  = async (id, status) => {
    try {
        const result = await categorieRepository.updateCategorieStatus(id, status);
        if (!result) {
            throw new Error('SERVICE: No se pudo actualizar el estado de la categoria');
        }
        return result;
    } catch (error) {
        throw new Error('SERVICE: Error al cambiar el estado de la categoría: ' + error.message);
    }
}

const deleteOneCategorie = async (id) => {
    try {
        const hasProducts = await categorieRepository.checkIfCategoryHasProducts(id);
        if (hasProducts) {
            throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
        }
        const result = await categorieRepository.deleteCategorie(id);
        if (result === 0) {
            throw new Error('Categoría no encontrada');
        }

        return result;
    } catch (error) {
        if (error.message.includes('productos asociados')) {
            throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
        } else if (error.message.includes('no encontrada')) {
            throw new Error('La categoría que intentas eliminar no existe');
        }
        throw error;
    }
};


module.exports = {
    getAllCategories,
    getOneCategorie,
    createCategorie,
    updateCategorie,
    updateCategorieStatus,
    deleteOneCategorie
};
