import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterClass = () => {
    const { user, login } = useAuth(); // 로그인, 사용자 업뎃
    const navigate = useNavigate();

    const [schedule, setSchedule] = useState(user.schedule || []);
    const [newClass, setNewClass] = useState({ className: '', day: 'Monday', time: '', endTime: '' });

    const handleAdd = () => {
        if (newClass.className && newClass.time && newClass.endTime) {
            setSchedule([...schedule, newClass]);
            setNewClass({ className: '', day: 'Monday', time: '', endTime: '' });
        }
    };

    const handleRemove = (index) => {
        const updated = [...schedule];
        updated.splice(index, 1);
        setSchedule(updated);
    };

    const handleSave = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/user/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-student-id': user.studentId
                },
                body: JSON.stringify({ schedule })
            });

            if (res.ok) {
                // 업데이트
                const updatedUser = { ...user, schedule };
                login(updatedUser);
                navigate('/');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h2 className="mb-4">시간표 관리</h2>

            <div className="card mb-4">
                <div className="flex gap-4 items-center">
                    <input
                        className="input"
                        placeholder="수업명 (예 CS101)"
                        value={newClass.className}
                        onChange={e => setNewClass({ ...newClass, className: e.target.value })}
                        style={{ marginBottom: 0 }}
                    />
                    <select
                        className="input"
                        value={newClass.day}
                        onChange={e => setNewClass({ ...newClass, day: e.target.value })}
                        style={{ marginBottom: 0 }}
                    >
                        {['월요일', '화요일', '수요일', '목요일', '금요일'].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <input
                        className="input"
                        type="time"
                        value={newClass.time}
                        onChange={e => setNewClass({ ...newClass, time: e.target.value })}
                        style={{ marginBottom: 0 }}
                    />
                    <span style={{ padding: '0 0.5rem' }}>-</span>
                    <input
                        className="input"
                        type="time"
                        value={newClass.endTime}
                        onChange={e => setNewClass({ ...newClass, endTime: e.target.value })}
                        style={{ marginBottom: 0 }}
                    />
                    <button className="btn" onClick={handleAdd}>추가</button>
                </div>
            </div>

            <div className="card">
                <h3>저장된 시간표</h3>
                {schedule.length === 0 && <p className="text-muted">아직 시간표 등록을 하지 않았습니다.</p>}
                {schedule.map((cls, idx) => (
                    <div key={idx} className="flex justify-between items-center" style={{ padding: '1rem 0', borderBottom: '1px solid var(--neutral)' }}>
                        <div>
                            <strong>{cls.className}</strong>
                            <span style={{ margin: '0 1rem', color: 'var(--text-muted)' }}>|</span>
                            {cls.day} {cls.time} - {cls.endTime}
                        </div>
                        <button className="btn btn-secondary" onClick={() => handleRemove(idx)}>제거</button>
                    </div>
                ))}

                <div className="mt-4 text-center">
                    <button className="btn" onClick={handleSave} style={{ width: '200px' }}>시간표 저장</button>
                </div>
            </div>
        </div>
    );
};

export default RegisterClass;
