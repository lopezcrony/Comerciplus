const { sequelize } = require('../config/db');
const { createInstallment } = require('../services/installments.service');
const installmentRepository = require('../repositories/installments.repository');
const creditRepository = require('../repositories/credits.repository');

// Se crean los mocks (simulaciones) para la base de datos
jest.mock('../config/db', () => ({
    sequelize: {
        // Aquí se simulan diferentes funciones de la base de datos con jest.fn()
        define: jest.fn().mockReturnValue({}),
        DataTypes: {
            INTEGER: jest.fn(),
            FLOAT: jest.fn(),
            DATE: jest.fn(),
            BOOLEAN: jest.fn()
        },
        // Simular un proceso transaction
        transaction: jest.fn().mockImplementation(() => ({
            commit: jest.fn(),
            rollback: jest.fn()
        }))
    }
}));

// Mocks para los repositorios
jest.mock('../repositories/installments.repository');
jest.mock('../repositories/credits.repository');


describe('createInstallment', () => {
    it('Debe registrar un abono', async () => {

        // Datos de prueba
        const installmentData = {
            idCredito: 1,
            montoAbonado: 100
        };

        // Simula una transacción de base de datos
        const mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        };

        // Datos de un crédito falso
        const mockCredit = {
            idCredito: 1,
            totalCredito: 500
        };

        // Datos de un nuevo abono creado
        const mockNewInstallment = {
            idCredito: 1,
            montoAbonado: 100,
        };

        // Se configuran los mocks para simular el proceso
        sequelize.transaction.mockResolvedValue(mockTransaction);

        creditRepository.findCreditById.mockResolvedValue(mockCredit);
        installmentRepository.registerInstallment.mockResolvedValue(mockNewInstallment);
        creditRepository.updateTotalCredit.mockResolvedValue(null);

        // Ejecutamos la función que queremos probar
        const result = await createInstallment(installmentData);

        // Verificamos que cada paso se haya realizado correctamente
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(creditRepository.findCreditById).toHaveBeenCalledWith(
            installmentData.idCredito,
            { transaction: mockTransaction }
        );
        expect(installmentRepository.registerInstallment).toHaveBeenCalledWith(
            expect.objectContaining({
                ...installmentData,
                fechaAbono: expect.any(Date),
                estadoAbono: true
            }),
            { transaction: mockTransaction }
        );
        expect(creditRepository.updateTotalCredit).toHaveBeenCalledWith(
            installmentData.idCredito,
            400,
            { transaction: mockTransaction }
        );
        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(result).toEqual(mockNewInstallment);
    });

});