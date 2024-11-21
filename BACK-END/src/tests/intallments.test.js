const request = require('supertest');
const app = require('../../main'); // Import the app promise

jest.setTimeout(20000); // Increased timeout to 20 seconds

describe('GET /abonos', () => {
    let server;

    beforeAll(async () => {
        // Wait for the app to be fully initialized
        server = await app;
    });

    test('Debería retornar un array con los abonos según el crédito', async () => {
        const res = await request(server).get('/abonos/2');
        console.log('Response status:', res.statusCode);
        console.log('Response body:', res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    afterAll(async () => {
        // Close the server if needed
    });
});