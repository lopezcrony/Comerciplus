const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV;
const envPath = path.resolve(__dirname, `../../.env.${env}`);
dotenv.config({ path: envPath });

if (!process.env.DB_DIALECT) {
    throw new Error('DB_DIALECT no está definido en el archivo de entorno.');
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: false,
        dialectOptions: process.env.DB_SSL_MODE === 'REQUIRED' ? {
            ssl: {
                require: true,
                ca: fs.readFileSync(path.resolve(__dirname, 'aiven-ca.pem')).toString(),
                rejectUnauthorized: true
            },
            connectTimeout: 120000
        } : {},
        define: {
            timestamps: false // Opcional: evita timestamps automáticos si no los usas
        },
    }
);

const createDatabaseIfNotExists = async () => {
    try {
        // Crea una conexión temporal a MySQL
        const tempSequelize = new Sequelize(
            `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
            { dialect: 'mysql', logging: false }
        );

        await tempSequelize.authenticate();

        // Se crea la base de datos si no existe
        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

        // Cierra la conexión temporal
        await tempSequelize.close();

    } catch (error) {
        console.error('Error al conectar o crear la base de datos:', error.message);
        console.error('Detalles:', error);
    }
};

// Función para establecer la conexión después de asegurarnos que la BD existe
const connectToDatabase = async () => {
    try {
        await createDatabaseIfNotExists();
        await sequelize.authenticate();
        console.log(`\nConexión establecida a la base de datos "${process.env.DB_NAME}" puerto ${process.env.DB_PORT}.`);
    } catch (error) {
        console.error('Error de conexión completo:', error);
        console.error('Mensaje de error:', error.message);
        console.error('Código de error:', error.code);
        throw error;
    }
    return sequelize;
};

module.exports = { sequelize, connectToDatabase };