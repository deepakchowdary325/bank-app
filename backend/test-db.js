const mysql = require('mysql2/promise');
require('dotenv').config();

const testConnection = async () => {
    console.log('Testing connection with:');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Port:', process.env.DB_PORT);
    console.log('Database:', process.env.DB_NAME);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        console.log('Successfully connected!');
        const [rows] = await connection.query('SELECT 1 + 1 AS result');
        console.log('Query result:', rows[0].result);
        await connection.end();
    } catch (error) {
        console.error('Connection failed:');
        console.error(error);
    }
};

testConnection();
