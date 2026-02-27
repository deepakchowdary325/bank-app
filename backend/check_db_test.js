const { pool } = require('./config/db');

async function check() {
    try {
        const [rows] = await pool.query('SELECT 1 as connection_test');
        console.log('Database connection test successful:', rows);

        const [tables] = await pool.query('SHOW TABLES');
        console.log('Tables in database:', tables.map(t => Object.values(t)[0]));

        process.exit(0);
    } catch (err) {
        console.error('Database connection test failed:', err.message);
        process.exit(1);
    }
}

check();
