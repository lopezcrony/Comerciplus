const Categories = require('../models/categories.model');

const findAllCategories = async () => {
    return await Categories.findAll();
};

const findCategorieById = async (id) => {
    return await Categories.findByPk(id);
};

const createCategorie = async (categorieData) => {
    return await Categories.create(categorieData);
};

const updateCategorie = async (id, categorieData) => {
    const categorie = await findCategorieById(id);
    if (categorie) {
        return await categorie.update(categorieData);
    }
    throw new Error('categoria no encontrada');
};

const updateCategorieStatus = async (id, status) => {

    const categorie = await findCategorieById(id);
    if (categorie) {
        return await categorie.update({estadoCategoria : status});
    }
    throw new Error('REPOSITORY: Categoria no encontrada');
};

const deleteCategorie = async (id) => {
    const result = await Categories.destroy({
        where: { 	idCategoria: id }
    });
    return result;
};


module.exports = {
    findAllCategories,
    findCategorieById,
    createCategorie,
    updateCategorie,
    updateCategorieStatus,
    deleteCategorie,
};
