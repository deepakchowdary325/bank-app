import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, User, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="auth-container" style={{ justifyContent: 'flex-start', paddingTop: '4rem' }}>
            <motion.div
                className="auth-card fade-in"
                style={{ maxWidth: '800px' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <LayoutDashboard size={28} color="#38bdf8" style={{ marginRight: '0.75rem' }} />
                        <h1 style={{ margin: 0 }}>Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ width: 'auto', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                    >
                        <LogOut size={18} style={{ marginRight: '0.5rem' }} />
                        Logout
                    </button>
                </div>

                <div className="fade-in" style={{ backgroundColor: 'rgba(56, 189, 248, 0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(56, 189, 248, 0.1)', marginBottom: '2rem' }}>
                    <h2 style={{ marginTop: 0 }}>Welcome back, {user.username}!</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>You are securely logged into your account. Here is your profile information.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            <User size={16} style={{ marginRight: '0.5rem' }} />
                            <span>Username</span>
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{user.username}</div>
                    </div>
                    <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            <ShieldCheck size={16} style={{ marginRight: '0.5rem' }} />
                            <span>Role</span>
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#22c55e' }}>{user.role}</div>
                    </div>
                    <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            <Clock size={16} style={{ marginRight: '0.5rem' }} />
                            <span>Status</span>
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>Active</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
