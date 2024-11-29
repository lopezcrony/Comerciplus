const categorieService = require('../services/categories.service')

const getAllCategories = async (req, res) => {
    try {
        const categories = await categorieService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOneCategorie = async (req, res) => {
    try {
        const categorie = await categorieService.getOneCategorie(req.params.id);
        res.status(200).json(categorie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCategorie = async (req, res) => {
    try {
        const newCategorie = await categorieService.createCategorie(req.body);
        res.status(201).json({ message: 'Categoria registrada exitosamente.', newCategorie });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategorie = async (req, res) => {
    try {
        const updatedCategorie = await categorieService.updateCategorie(req.params.id, req.body);
        res.status(200).json({ message: 'Categoria actualizada exitosamente', updatedCategorie});
    } catch (error) {
        if (error.message === 'El nombre de la categoria ya está registrado.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

const updateCategorieStatus  = async (req, res) => {
    try {
        let { estadoCategoria } = req.body;

        if (estadoCategoria === '0' || estadoCategoria === 0) {
            estadoCategoria = false;
        } else if (estadoCategoria === '1' || estadoCategoria === 1) {
            estadoCategoria = true;
        } else if (estadoCategoria === true || estadoCategoria === false) {
            
        } else {
            return res.status(400).json({ message: 'El estado debe ser un valor booleano' });
        }
        await categorieService.updateCategorieStatus (req.params.id, estadoCategoria);
        res.json({ message: 'Estado actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOneCategorie = async (req, res) => {
    try {
        const categorie = await categorieService.deleteOneCategorie(req.params.id);
        if(categorie){
        res.json({ message: 'Categoria eliminada con éxito.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCategories,
    getOneCategorie,
    createCategorie,
    updateCategorie,
    updateCategorieStatus,
    deleteOneCategorie
}