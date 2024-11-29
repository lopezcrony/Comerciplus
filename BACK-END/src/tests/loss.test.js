const { getOneReturnLoss } = require('../services/lossTest.service');
const testLossRepository = require('../repositories/lossTest.repository');

// Simulamos el funcionamiento de una base de datos
jest.mock('../config/db', () => ({
    sequelize: {
        define: jest.fn().mockReturnValue({}),
    }
}));

jest.mock('../repositories/lossTest.repository', () => ({
    findReturnLossById: jest.fn()
}));

describe('Loss Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getOneReturnLoss', () => {
        it('Debe devolver los registros de una pérdida', async () => {

            // Se crean datos de prueba falsos
            const mockLoss = [
                {
                    idDevolucionDeBaja: 2,
                    idCodigoBarra: 5,
                    cantidad: 1,
                    fechaDeBaja: new Date(),
                    motivo: 'Los dejé caer y se dañaron',
                },
                {
                    idDevolucionDeBaja: 1,
                    idCodigoBarra: 3,
                    cantidad: 2,
                    fechaDeBaja: new Date(),
                    motivo: 'La nevera se apagó',
                }
            ];

            // Configuramos el repositorio para que devuelva los datos de prueba falsos
            testLossRepository.findReturnLossById.mockResolvedValue(mockLoss);

            // Se llama la función a testear
            const result = await getOneReturnLoss(1);

            // Verificamos que el resultado sea igual a nuestros datos falsos
            expect(result).toEqual(mockLoss);

            // Verificamos que se llamó al repositorio con el id correcto
            expect(testLossRepository.findReturnLossById).toHaveBeenCalledWith(1);
        });

        it('Debe mostrar los errores correspondientes', async () => {
            // Simulamos un error
            const errorMessage = 'Error al obtener los registros de la pérdida';
            testLossRepository.findReturnLossById.mockRejectedValue(new Error(errorMessage));

            // Verificamos que la función lance el error esperado
            await expect(getOneReturnLoss(1)).rejects.toThrow(errorMessage);
        });
    });

});
