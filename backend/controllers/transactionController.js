const { db } = require('../config/db');

// Get User Balance
const getBalance = async (req, res) => {
    try {
        const [users] = await db.pool.query('SELECT balance FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ balance: users[0].balance });
    } catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Transaction History
const getTransactions = async (req, res) => {
    try {
        const [transactions] = await db.pool.query(`
            SELECT t.*, 
                   s.username as sender_name, 
                   r.username as receiver_name 
            FROM transactions t
            LEFT JOIN users s ON t.sender_id = s.id
            LEFT JOIN users r ON t.receiver_id = r.id
            WHERE t.sender_id = ? OR t.receiver_id = ?
            ORDER BY t.created_at DESC
        `, [req.user.id, req.user.id]);

        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Transfer Money
const transferMoney = async (req, res) => {
    const { receiverEmail, amount, description } = req.body;
    const senderId = req.user.id;

    if (!receiverEmail || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid transfer details' });
    }

    let connection;
    try {
        connection = await db.pool.getConnection();
        await connection.beginTransaction();

        // 1. Check sender balance
        const [senders] = await connection.query('SELECT balance, email FROM users WHERE id = ?', [senderId]);
        if (senders[0].balance < amount) {
            await connection.rollback();
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        if (senders[0].email === receiverEmail) {
            await connection.rollback();
            return res.status(400).json({ message: 'Cannot transfer to yourself' });
        }

        // 2. Find receiver
        const [receivers] = await connection.query('SELECT id FROM users WHERE email = ?', [receiverEmail]);
        if (receivers.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Receiver not found' });
        }
        const receiverId = receivers[0].id;

        // 3. Deduct from sender
        await connection.query('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, senderId]);

        // 4. Add to receiver
        await connection.query('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, receiverId]);

        // 5. Record transaction
        await connection.query(
            'INSERT INTO transactions (sender_id, receiver_id, amount, type, description) VALUES (?, ?, ?, ?, ?)',
            [senderId, receiverId, amount, 'TRANSFER', description || 'Money Transfer']
        );

        await connection.commit();
        res.json({ message: 'Transfer successful' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Transfer error:', error);
        res.status(500).json({ message: 'Transfer failed', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { getBalance, getTransactions, transferMoney };
