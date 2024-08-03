const detailCredit = require('../models/creditDetail.model')

const getDetailCredit = async (idCredit) => {
    return await detailCredit.findAll({
        where: { idCredito: idCredit }
    });
};

const addVentaToCredito = async (creditDetailData) => {
    return await detailCredit.create(creditDetailData);
};

const deleteDetailCredit = async (id) => {
    const result = await detailCredit.destroy({
        where: { idDetalleCredito: id }
    });
    return result;
};

// const getSalesByCredit = async (idCredito) => {
//     try {
//         const details = await detailCredit.findAll({
//             where: { idCredito: idCredito }
//         });

//         const salesIds = details.map(detail => detail.idVenta);

//         return salesIds;
//     } catch (error) {
//         throw new Error('REPOSITORY: Error al obtener ventas por crédito');
//     }
// };
    
module.exports = {
    getDetailCredit,
    addVentaToCredito,
    deleteDetailCredit
};



