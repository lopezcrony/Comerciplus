const creditRepository = require('../repositories/credits.repository');
const creditDeatilRepository = require('../repositories/detailCredit.repository');
const installmentRepository = require('../repositories/installments.repository');

const getAllCredits = async () => {
    try {
        return await creditRepository.findAllCredits();
    } catch (error) {
        throw error;
    }
};

const getOneCredit = async (id) => {
    try {
        return await creditRepository.findCreditById(id);
    } catch (error) {
        throw error;
    }
};

const getCreditsByClient = async (idClient) => {
    try {
        return await creditRepository.findCreditByClient(idClient);
    } catch (error) {
        throw error;
    }
}

const getCreditHistoryByClient = async (idClient) => {
    const credit = await creditRepository.findCreditByClient(idClient);

    if (!credit) {
        throw new Error('Crédito no encontrado para ese cliente');
    }
    const creditDetail = await creditDeatilRepository.getAllDetailCredit(credit[0].idCredito);
    const installments = await installmentRepository.getInstallmentsByCredit(credit[0].idCredito);

    // Se combinan las tablas de abonos y detalle de crédito y se ordenan por fecha
    const historyItems = [
        ...creditDetail.map(d => ({
            fecha: d.createdAt,
            tipo: 'Crédito',
            monto: d.montoAcreditado,
            plazoMaximo: d.plazoMaximo
        })),
        ...installments.map(a => ({
            idAbono: a.idAbono,
            fecha: a.fechaAbono,
            tipo: 'Abono',
            monto: a.montoAbonado,
            estadoAbono: a.estadoAbono,
        })),
    ].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Calcula el total acumulado
    let totalAcumulado = 0;
    const historyWithTotal = historyItems.map(item => {
        if (item.tipo === 'Crédito') {
            totalAcumulado += item.monto;
        } else if (item.tipo === 'Abono' && item.estadoAbono !== false) {
            totalAcumulado -= item.monto;
        } 
        
        return {
            ...item,
            saldo: totalAcumulado
        };
    });

    return historyWithTotal;
};

const createCredit = async (creditData) => {
    try {
        return await creditRepository.createCredit(creditData);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Ya existe un crédito asociado a este cliente.');
        }
        throw error;
    }
};

const updateTotalCredit = async (id, newTotalCredit) => {
    try {
        const result = await creditRepository.updateTotalCredit(id, newTotalCredit);
        if (!result) {
            throw new Error('El valor total del crédito no pudo ser actualizado.');
        };
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteOneCredit = async (id) => {
    try {
        const result = await creditRepository.deleteOneCredit(id);
        if (result === 0) {
            throw new Error('SERVICE: Crédito no encontrado');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllCredits,
    getOneCredit,
    getCreditsByClient,
    getCreditHistoryByClient,
    createCredit,
    updateTotalCredit,
    deleteOneCredit,
};