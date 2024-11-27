// Primero se importan los módulos necesarios
const { getInstallmentsByCredit, createInstallment } = require('../services/installments.service');
const installmentRepository = require('../repositories/installments.repository');
const creditRepository = require('../repositories/credits.repository');
const { sequelize } = require('../config/db');

// Simulamos el funcionamiento de una base de datos

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

describe('Installments Service', () => {

    // Se limpian los mocks antes de cada prueba para que no quede algun registro de una prueba anterior
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getInstallmentsByCredit', () => {
        it('Debe devolver los abonos realizados a un crédito', async () => {

        // Se crean datos de prueba falsos
            const mockInstallments = [
                { 
                    idAbono: 1, 
                    idCredito: 1,
                    montoAbonado: 100,
                    fechaAbono: new Date(),
                    estadoAbono: true
                },
                { 
                    idAbono: 2, 
                    idCredito: 1,
                    montoAbonado: 200,
                    fechaAbono: new Date(),
                    estadoAbono: true
                }
            ];

            // Configuramos el repositorio para que devuelva los datos de prueba falsos
            installmentRepository.getInstallmentsByCredit.mockResolvedValue(mockInstallments);

            // Se llama la función a testear
            const result = await getInstallmentsByCredit(1);
            
            // Verificamos que el resultado sea igual a nuestros datos falsos
            expect(result).toEqual(mockInstallments);

            // Verificamos que se llamó al repositorio con el id correcto
            expect(installmentRepository.getInstallmentsByCredit).toHaveBeenCalledWith(1);
        });

        it('Debe mostrar los errores correspondientes', async () => {
            // Simulamos un error
            const errorMessage = 'Error al obtener los abonos';
            installmentRepository.getInstallmentsByCredit.mockRejectedValue(new Error(errorMessage));

            // Verificamos que la función lance el error esperado
            await expect(getInstallmentsByCredit(1)).rejects.toThrow(errorMessage);
        });
    });

// -------------------------- Prueba para la función de registar abono --------------------------
   
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
});