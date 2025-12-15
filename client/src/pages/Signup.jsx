import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        studentId: '',
        email: '',
        password: '',
        name: '',
        gender: 'Male'
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/auth/signup', {
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
        <div className="container flex items-center justify-between" style={{ minHeight: '100vh', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">회원가입</h2>
                {error && <div style={{ color: 'var(--secondary)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        className="input"
                        placeholder="학번"
                        value={formData.studentId}
                        onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="이메일"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="이름"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <select
                        className="input"
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    >
                        <option value="남자">남자</option>
                        <option value="여자">여자</option>
                        <option value="기타">기타</option>
                    </select>
                    <input
                        className="input"
                        type="password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button className="btn" style={{ width: '100%' }}>로그인</button>
                </form>
                <div className="text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                    이미 계정이 있으신가요? <Link to="/login" style={{ color: 'var(--primary)' }}>로그인</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
