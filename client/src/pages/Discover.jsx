import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Discover = () => {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/match/recommendations', {
                    headers: { 'x-student-id': user.studentId }
                });
                if (res.ok) {
                    const data = await res.json();
                    setRecommendations(data);
                }
            } catch (err) {
                console.error("로드하지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user.studentId]);

    const handleLike = async (targetId) => {
        try {
            const res = await fetch('http://localhost:3000/api/match/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-student-id': user.studentId
                },
                body: JSON.stringify({ targetId })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.isMatch) {
                    alert("두근두근 매칭 성공!");
                }
                setRecommendations(prev => prev.filter(u => u.studentId !== targetId));
            }
        } catch (err) {
            console.error("Like failed");
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="flex justify-between items-center mb-4">
                <h2>매칭</h2>
                <Link to="/" className="btn btn-secondary">돌아가기</Link>
            </div>

            {loading ? (
                <p className="text-center">Loading potential matches...</p>
            ) : recommendations.length === 0 ? (
                <div className="card text-center" style={{ padding: '3rem' }}>
                    <h3>No matches found yet.</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Make sure you have registered your classes!
                        We match you with people who share your schedule.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {recommendations.map(u => (
                        <div key={u.studentId} className="card">
                            <div style={{ height: '200px', backgroundColor: 'var(--neutral)', borderRadius: 'var(--radius) var(--radius) 0 0', margin: '-2rem -2rem 1rem -2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {/* Placeholder for User Image */}
                                <span style={{ fontSize: '3rem' }}>👤</span>
                            </div>
                            <h3>{u.name}</h3>
                            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>{u.gender}</p>

                            {/* Simple Shared Class Display */}
                            <div className="mb-4">
                                <strong>같은 시간표:</strong>
                                <ul
                                    style={{
                                        marginLeft: '1.5rem',
                                        marginTop: '0.5rem',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    {u.sharedCourses.map((c, idx) => (
                                        <li key={idx}>
                                             {c.className} ({c.day} {c.time})</li>
                                    ))}
                                </ul>


                            </div>

                            <button className="btn" style={{ width: '100%' }} onClick={() => handleLike(u.studentId)}>
                                좋아요 보내기
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Discover;
