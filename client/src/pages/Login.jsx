import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user);
                navigate('/');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <div className="container flex-col items-center justify-center" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <div className="text-center mb-4">
                <img src="/logo.png" alt="UniMatch Logo" style={{ width: '150px', height: 'auto' }} />
            </div>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">대학생 시간표 기반</h2>
                <p className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '-0.5rem', marginBottom: '1.5rem' }}>소개팅 서비스 로그인</p>
                {error && <div style={{ color: 'var(--secondary)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        className="input"
                        placeholder="이메일 *"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        className="input"
                        type="password"
                        placeholder="비밀번호 *"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button className="btn" style={{ width: '100%' }}>로그인</button>
                </form>
                <div className="text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                    계정이 없으신가요? <Link to="/signup" style={{ color: 'var(--primary)' }}>회원가입</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
