import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/api';
import {
    LayoutDashboard, LogOut, User, ShieldCheck,
    Wallet, Send, History, ArrowUpRight, ArrowDownLeft,
    RefreshCw, AlertCircle, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transferData, setTransferData] = useState({ email: '', amount: '', description: '' });
    const [transferLoading, setTransferLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user?.id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/transactions/history');
            setTransactions(res.data);
        } catch (err) {
            console.error('Fetch dashboard data error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setTransferLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await api.post('/transactions/transfer', {
                receiverEmail: transferData.email,
                amount: parseFloat(transferData.amount),
                description: transferData.description
            });

            setMessage({ type: 'success', text: res.data.message });
            setTransferData({ email: '', amount: '', description: '' });
            await refreshUser();
            await fetchData();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Transfer failed' });
        } finally {
            setTransferLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="auth-container" style={{ justifyContent: 'flex-start', paddingTop: '2rem', minHeight: '100vh', overflowY: 'auto' }}>
            <div style={{ width: '100%', maxWidth: '1000px', padding: '0 1rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <LayoutDashboard size={32} color="#38bdf8" style={{ marginRight: '1rem' }} />
                        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Bank Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary"
                        style={{ width: 'auto', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    >
                        <LogOut size={18} style={{ marginRight: '0.5rem' }} />
                        Sign Out
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                    {/* Left Column: Balance & Profile */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Balance Card */}
                        <motion.div
                            className="auth-card"
                            style={{ margin: 0, padding: '2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(56, 189, 248, 0.2)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em' }}>TOTAL BALANCE</span>
                                <Wallet size={24} color="#38bdf8" />
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                                ${parseFloat(user.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', color: '#22c55e', fontSize: '0.875rem' }}>
                                <ShieldCheck size={14} style={{ marginRight: '0.4rem' }} />
                                Account Protected
                            </div>
                        </motion.div>

                        {/* Profile Info */}
                        <div className="auth-card" style={{ margin: 0, padding: '1.5rem' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '1.25rem', fontSize: '1.125rem' }}>Account Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ color: '#94a3b8' }}>Account Holder</span>
                                    <span style={{ fontWeight: 600 }}>{user.username}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ color: '#94a3b8' }}>Email</span>
                                    <span style={{ fontWeight: 600 }}>{user.email}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#94a3b8' }}>Tier</span>
                                    <span style={{ fontWeight: 600, color: '#38bdf8' }}>{user.role}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Transfer Money */}
                    <motion.div
                        className="auth-card"
                        style={{ margin: 0, padding: '2rem' }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <Send size={24} color="#38bdf8" style={{ marginRight: '0.75rem' }} />
                            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Send Money</h2>
                        </div>

                        <form onSubmit={handleTransfer}>
                            <div className="form-group">
                                <label>Recipient Email</label>
                                <input
                                    type="email"
                                    placeholder="friend@example.com"
                                    value={transferData.email}
                                    onChange={(e) => setTransferData({ ...transferData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount ($)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0.01"
                                    value={transferData.amount}
                                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Dinner, rent, etc."
                                    value={transferData.description}
                                    onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                                />
                            </div>

                            <AnimatePresence>
                                {message.text && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={message.type === 'success' ? 'success-message' : 'error-message'}
                                        style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}
                                    >
                                        {message.type === 'success' ? <CheckCircle2 size={16} style={{ marginRight: '0.5rem' }} /> : <AlertCircle size={16} style={{ marginRight: '0.5rem' }} />}
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button type="submit" disabled={transferLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {transferLoading ? <><RefreshCw className="spin" size={18} style={{ marginRight: '0.5rem' }} /> Processing...</> : 'Confirm Transfer'}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Transaction History - Full Width */}
                <motion.div
                    className="auth-card"
                    style={{ margin: 0, padding: '2rem' }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <History size={24} color="#38bdf8" style={{ marginRight: '0.75rem' }} />
                            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Recent History</h2>
                        </div>
                        <button onClick={fetchData} className="btn-secondary" style={{ width: 'auto', padding: '0.4rem', borderRadius: '50%' }}>
                            <RefreshCw size={16} className={loading ? 'spin' : ''} />
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ color: '#94a3b8', fontSize: '0.875rem', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem 0' }}>Activity</th>
                                    <th style={{ padding: '1rem 0' }}>Recipient/Sender</th>
                                    <th style={{ padding: '1rem 0' }}>Date</th>
                                    <th style={{ padding: '1rem 0', textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2rem 0', textAlign: 'center', color: '#94a3b8' }}>
                                            No transactions found yet.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map(t => {
                                        const isOutgoing = t.sender_id === user.id;
                                        return (
                                            <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.95rem' }}>
                                                <td style={{ padding: '1rem 0' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{
                                                            padding: '0.5rem',
                                                            borderRadius: '50%',
                                                            backgroundColor: isOutgoing ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                            marginRight: '0.75rem'
                                                        }}>
                                                            {isOutgoing ? <ArrowUpRight size={16} color="#ef4444" /> : <ArrowDownLeft size={16} color="#22c55e" />}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600 }}>{t.description || 'Transfer'}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.type}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 0' }}>
                                                    {isOutgoing ? t.receiver_name : t.sender_name}
                                                </td>
                                                <td style={{ padding: '1rem 0', color: '#94a3b8' }}>
                                                    {new Date(t.created_at).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 700, color: isOutgoing ? '#ef4444' : '#22c55e' }}>
                                                    {isOutgoing ? `- $${parseFloat(t.amount).toFixed(2)}` : `+ $${parseFloat(t.amount).toFixed(2)}`}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
