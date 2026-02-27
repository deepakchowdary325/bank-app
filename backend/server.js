const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { initDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => callback(null, true), // Allow any origin for development/demo
    credentials: true
}));

// Initialize Database
initDB();

// Routes
app.use('/api/auth', authRoutes);

// Test Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Auth System API is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
