const Credit = require('../models/credits.model');

const findAllCredits = async () => {
    return await Credit.findAll();
};

const findCreditById = async (id) => {
    return await Credit.findByPk(id);
};

const findCreditByClient = async (id) => {
    return await Credit.findAll({
        where: { idCliente: id }
    });
};

const createCredit = async (creditData) => {
    return await Credit.create(creditData);
};

const updateTotalCredit = async (id, newTotalCredit, options = {}) => {
    const credit = await findCreditById(id, options);
    if (credit) {
        return await credit.update({ totalCredito: newTotalCredit }, options);
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
    findCreditByClient,
    createCredit,
    updateTotalCredit,
    deleteOneCredit,

};

