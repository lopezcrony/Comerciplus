const request = require('supertest');
const app = require('../../main');

jest.setTimeout(300000);

describe('GET /abonos', () => {
    let server;

    beforeAll(async () => {
        jest.setTimeout(30000);
        try {
            server = await app;
        } catch (error) {
            console.error('Error al iniciar el servidor:', error);
            throw error;
        }
    });

    test('Debería retornar un array con los abonos según el crédito', async () => {
        const res = await request(server).get('/abonos/1');
        console.log('Response status:', res.statusCode);
        console.log('Response body:', res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    afterAll(async () => {
        if (server) {
            await server.close();
        }
    });

});