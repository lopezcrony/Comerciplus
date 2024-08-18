const detailCredit = require('../models/creditDetail.model')

const getAllDetailCredit = async (idCredit) => {
    try {
        return await detailCredit.findAll({
            where: { idCredito: idCredit }
        });
    } catch (error) {
        throw new Error('REPOSITORY: ' + error.message)
    }
};

const addVentaToCredito = async (creditDetailData, options = {}) => {
    try {
        return await detailCredit.create(creditDetailData, options);
    } catch (error) {
        throw new Error('REPOSITORY:' + error.message);
    }
};

const deleteOneDetailCredit = async (id) => {
    const result = await detailCredit.destroy({
        where: { iddetallecredito: id }
    });
    return result;
};

module.exports = {
    getAllDetailCredit,
    addVentaToCredito,
    deleteOneDetailCredit
};