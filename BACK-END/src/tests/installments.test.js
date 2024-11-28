// Primero se importan los módulos necesarios
const { getInstallmentsByCredit } = require('../services/installments.service');
const installmentRepository = require('../repositories/installments.repository');

// Simulamos el funcionamiento de una base de datos
jest.mock('../config/db', () => ({
    sequelize: {
        define: jest.fn().mockReturnValue({}),
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

});