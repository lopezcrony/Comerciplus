const detailCreditService = require('../repositories/installments.repository');

const getDetailCredit = async (idCredit) => {
    
};

const addVentaToCredito = async (creditDetailData) => {
    
};

const deleteDetailCredit = async (id) => {
    
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



