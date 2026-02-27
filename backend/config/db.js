const mysql = require('mysql2/promise');
require('dotenv').config();

// Simple in-memory mock to allow development when DB is unreachable
const mockPool = {
    users: [],
    async getConnection() {
        return {
            query: async (sql, params) => this.query(sql, params),
            release: () => { }
        };
    },
    async query(sql, params) {
        console.log('MOCK DB QUERY:', sql, params);
        if (sql.includes('CREATE TABLE')) return [{}];
        if (sql.includes('SELECT id FROM users WHERE email = ?')) {
            const user = this.users.find(u => u.email === params[0] || u.username === params[1]);
            return [user ? [user] : []];
        }
        if (sql.includes('INSERT INTO users')) {
            const newUser = { id: this.users.length + 1, username: params[0], email: params[1], phone: params[2], password: params[3], role: 'USER' };
            this.users.push(newUser);
            return [{ insertId: newUser.id }];
        }
        if (sql.includes('SELECT * FROM users WHERE email = ?')) {
            const user = this.users.find(u => u.email === params[0]);
            return [user ? [user] : []];
        }
        if (sql.includes('SELECT id, username, email, role FROM users WHERE id = ?')) {
            const user = this.users.find(u => u.id === params[0]);
            return [user ? [user] : []];
        }
        return [[]];
    }
};

if (process.env.USE_MOCK_DB === 'true') {
    console.log('Using MOCK in-memory database.');
    pool = mockPool;
} else {
    console.log('Connecting to host:', process.env.DB_HOST);
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    });
}

const initDB = async () => {
    try {
        if (process.env.USE_MOCK_DB !== 'true') {
            const connection = await pool.getConnection();
            console.log('Connected to Aiven MySQL database.');
            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    phone VARCHAR(15),
                    password VARCHAR(255) NOT NULL,
                    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            await connection.query(createUsersTable);
            console.log('Users table checked/created.');
            connection.release();
        } else {
            console.log('Mock database initialized.');
        }
    } catch (error) {
        console.error('Database initialization error:', error.message);
        console.log('FALLING BACK TO MOCK DB FOR DEMONSTRATION');
        pool = mockPool;
    }
};

module.exports = { pool, initDB };
