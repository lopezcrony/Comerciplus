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

const getCreditHistory = async (idCredit) => {
    const credit = await creditRepository.findCreditById(idCredit);
    if (!credit) {
        throw new Error('Crédito no encontrado');
    }
    const creditDetail = await creditDeatilRepository.getAllDetailCredit(idCredit);
    const installments = await installmentRepository.getInstallmentsByCredit(idCredit);

    // Se combinan las tablas de abonos y detalle de crédito y se ordenan por fecha
    const historyItems = [
        ...creditDetail.map(d => ({
            fecha: d.createdAt,
            tipo: 'Crédito',
            monto: d.montoAcreditado,
            plazoMaximo: d.plazoMaximo
        })),
        ...installments.map(a => ({
            fecha: a.fechaAbono,
            tipo: 'Abono',
            monto: a.montoAbonado,
            estadoAbono: a.estadoAbono,
        }))
    ].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Calcula el total acumulado
    let totalAcumulado = 0;
    const historyWithTotal = historyItems.map(item => {
        if (item.tipo === 'Crédito') {
            totalAcumulado += item.monto;
        } else if (item.tipo === 'Abono' && item.estado !== false) {
            totalAcumulado -= item.monto;
        } else if (item.tipo === 'Anulado') {
            // No afecta el saldo, pero lo mostramos en el historial
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
    getCreditHistory,
    createCredit,
    updateTotalCredit,
    deleteOneCredit
};