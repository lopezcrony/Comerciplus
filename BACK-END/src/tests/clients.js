// const { createClient } = require('../services/clients.service');
// const { mockDeep } = require('jest-mock-extended');

// // Mocks de los repositorios
// const clientRepository = mockDeep();
// const creditRepository = mockDeep();

// // Sobrescribimos los repositorios en el módulo del servicio
// jest.mock('../repositories/clients.repository', () => clientRepository);
// jest.mock('../repositories/credit.repository', () => creditRepository);

// describe('Client Service - createClient', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('debe crear un nuevo cliente y un crédito asociado', async () => {
//         // Datos de ejemplo
//         const clientData = {
//             cedulaCliente: '1234567890',
//             nombreCliente: 'Cliente Test',
//             apellidoCliente: 'Apellido Test',
//             direccionCliente: 'Direccion Test',
//             telefonoCliente: '0987654321',
//         };
//         const createdClient = {
//             idCliente: 1,
//             ...clientData
//         };
//         const createdCredit = {
//             idCredito: 1,
//             idCliente: createdClient.idCliente,
//             totalCredito: 0
//         };

//         // Configuramos los mocks
//         clientRepository.createClient.mockResolvedValue(createdClient);
//         creditRepository.createCredit.mockResolvedValue(createdCredit);

//         // Ejecutamos la función
//         const result = await createClient(clientData);

//         // Validamos los resultados
//         expect(clientRepository.createClient).toHaveBeenCalledWith(clientData);
//         expect(creditRepository.createCredit).toHaveBeenCalledWith({
//             idCliente: createdClient.idCliente,
//             totalCredito: 0
//         });
//         expect(result).toEqual(createdClient);
//     });

//     it('debe lanzar un error si el cliente ya existe', async () => {
//         const clientData = {
//             cedulaCliente: '1234567890',
//             nombreCliente: 'Cliente Duplicado',
//             apellidoCliente: 'Apellido Test',
//             direccionCliente: 'Direccion Test',
//             telefonoCliente: '0987654321',
//         };

//         const error = new Error();
//         error.name = 'SequelizeUniqueConstraintError';
//         clientRepository.createClient.mockRejectedValue(error);

//         await expect(createClient(clientData)).rejects.toThrow('Ya existe un cliente con esa información.');

//         expect(clientRepository.createClient).toHaveBeenCalledWith(clientData);
//         expect(creditRepository.createCredit).not.toHaveBeenCalled();
//     });

//     it('debe propagar otros errores', async () => {
//         const clientData = {
//             cedulaCliente: '1234567890',
//             nombreCliente: 'Cliente Test',
//             apellidoCliente: 'Apellido Test',
//             direccionCliente: 'Direccion Test',
//             telefonoCliente: '0987654321',
//         };

//         const error = new Error('Otro error');
//         clientRepository.createClient.mockRejectedValue(error);

//         await expect(createClient(clientData)).rejects.toThrow('Otro error');

//         expect(clientRepository.createClient).toHaveBeenCalledWith(clientData);
//         expect(creditRepository.createCredit).not.toHaveBeenCalled();
//     });
// });