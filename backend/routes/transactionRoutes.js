const express = require('express');
const { getBalance, getTransactions, transferMoney } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/balance', protect, getBalance);
router.get('/history', protect, getTransactions);
router.post('/transfer', protect, transferMoney);

module.exports = router;
