const userRepository = require('../repositories/users.repository');
const { createNewUser } = require('../services/users.service');

// Simulamos el funcionamiento de una base de datos
jest.mock('../config/db', () => ({
  sequelize: {
      define: jest.fn().mockReturnValue({}),
  }
}));

// Mockeamos el repositorio
jest.mock('../repositories/users.repository', () => ({
    createNewUser: jest.fn(),
}));

describe('Users Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createNewUser', () => {
        it('Debe crear un nuevo usuario correctamente', async () => {
            const mockUserData = {
                idRol: 1,
                cedulaUsuario: '123456789',
                nombreUsuario: 'Juan',
                apellidoUsuario: 'Pérez',
                telefonoUsuario: '5551234567',
                correoUsuario: 'juan.perez@example.com',
                claveUsuario: 'password123',
            };

            const mockCreatedUser = { ...mockUserData, idUsuario: 1 };
            userRepository.createNewUser.mockResolvedValue(mockCreatedUser);

            const result = await createNewUser(mockUserData);

            expect(result).toEqual(mockCreatedUser);
            expect(userRepository.createNewUser).toHaveBeenCalledWith(mockUserData);
        });

        it('Debe lanzar un error si el usuario ya existe (error de restricción única)', async () => {
            const mockUserData = {
                idRol: 1,
                cedulaUsuario: '123456789',
                nombreUsuario: 'Juan',
                apellidoUsuario: 'Pérez',
                telefonoUsuario: '5551234567',
                correoUsuario: 'juan.perez@example.com',
                claveUsuario: 'password123',
            };

            const mockError = new Error();
            mockError.name = 'SequelizeUniqueConstraintError';

            userRepository.createNewUser.mockRejectedValue(mockError);

            await expect(createNewUser(mockUserData))
                .rejects.toThrow('Ya existe un usuario con esa información.');
        });

        it('Debe lanzar un error genérico si ocurre otro error', async () => {
            const mockUserData = {
                idRol: 1,
                cedulaUsuario: '123456789',
                nombreUsuario: 'Juan',
                apellidoUsuario: 'Pérez',
                telefonoUsuario: '5551234567',
                correoUsuario: 'juan.perez@example.com',
                claveUsuario: 'password123',
            };

            const mockError = new Error('Conexión fallida');
            userRepository.createNewUser.mockRejectedValue(mockError);

            await expect(createNewUser(mockUserData))
                .rejects.toThrow('Error al crear el usuario: Conexión fallida');
        });
    });
});
