import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const { register, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (formData.password !== formData.confirmPassword) {
            return setLocalError('Passwords do not match');
        }

        setLoading(true);
        const result = await register({
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        });
        setLoading(false);

        if (result.success) {
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                className="auth-card fade-in"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <UserPlus size={32} color="#818cf8" style={{ marginRight: '0.75rem' }} />
                    <h1>Create Account</h1>
                </div>
                <p className="subtitle">Join us to access your secure dashboard.</p>

                {(error || localError) && <div className="error-message">{error || localError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="johndoe"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number (Optional)</label>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="+1 234 567 890"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
