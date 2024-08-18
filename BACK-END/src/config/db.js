const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false
    }
);

const createDatabaseIfNotExists = async () => {
    try {
        // Crea una conexión temporal a MySQL
        const tempSequelize = new Sequelize(
            `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306`,
            { dialect: 'mysql', logging: false }
        );

        await tempSequelize.authenticate();

        // Se crea la base de datos si no existe
        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

        // Cierra la conexión temporal
        await tempSequelize.close();

    } catch (error) {
        console.error('Error al conectar o crear la base de datos:', error);
    }
};

// Función para establecer la conexión después de asegurarnos que la BD existe
const connectToDatabase = async () => {
    await createDatabaseIfNotExists();

    try {
        await sequelize.authenticate();
        console.log(`\nConexión establecida a la base de datos "${process.env.DB_NAME}".`);
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }

    return sequelize;
};

module.exports = { sequelize, connectToDatabase };
