const Credit = require('../models/credits.model');

const findAllCredits = async () => {
    return await Credit.findAll();
};

const findCreditById = async (id) => {
    return await Credit.findByPk(id);
};

const createCredit = async (creditData) => {
    return await Credit.create(creditData);
};

const updateTotalCredit = async (id, newTotalCredit) => {
    const credit = await findCreditById(id);
    if (credit) {
        return await credit.update({ totalCredito : newTotalCredit});
    }
    throw new Error('REPOSITORY: Crédito no encontrado');
};

const deleteOneCredit = async (id) => {
    const result = await Credit.destroy({
        where: { idCredito: id }
    });
    return result;
};


module.exports = {
    findAllCredits,
    findCreditById,
    createCredit,
    updateTotalCredit,
    deleteOneCredit
};

