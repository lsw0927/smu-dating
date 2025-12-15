import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Matches = () => {
    const { user } = useAuth();
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const pollInterval = useRef(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/match/matches', {
                    headers: { 'x-student-id': user.studentId }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMatches(data);
                }
            } catch (err) {
                console.error("Failed to load matches");
            }
        };
        fetchMatches();
    }, [user.studentId]);

    useEffect(() => {
        if (!selectedMatch) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/chat/${selectedMatch.studentId}`, {
                    headers: { 'x-student-id': user.studentId }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Process messages to be UI friendly
                    const uiMessages = data.map(m => ({
                        ...m,
                        time: new Date(m.timestamp).toLocaleTimeString()
                    }));
                    setMessages(uiMessages);
                }
            } catch (err) {
                console.error("Failed to load messages");
            }
        };

        fetchMessages();

        pollInterval.current = setInterval(fetchMessages, 2000);

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [selectedMatch, user.studentId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() && selectedMatch) {
            try {
                const res = await fetch('http://localhost:3000/api/chat/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-student-id': user.studentId
                    },
                    body: JSON.stringify({
                        receiverId: selectedMatch.studentId,
                        text: newMessage
                    })
                });

                if (res.ok) {
                    setNewMessage('');
                }
            } catch (err) {
                console.error("Failed to send message");
            }
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0', height: 'calc(100vh - 80px)' }}>
            <div className="flex justify-between items-center mb-4">
                <h2>메세지</h2>
                <Link to="/" className="btn btn-secondary">돌아가기</Link>
            </div>

            <div className="flex gap-4" style={{ height: '100%' }}>
                {/* Match List */}
                <div className="card" style={{ width: '300px', overflowY: 'auto' }}>
                    {matches.length === 0 && <p className="text-muted text-center mt-4">No matches yet. Keep liking!</p>}
                    {matches.map(m => (
                        <div
                            key={m.studentId}
                            onClick={() => { setSelectedMatch(m); setMessages([]); }}
                            style={{
                                padding: '1rem',
                                cursor: 'pointer',
                                borderBottom: '1px solid var(--neutral)',
                                backgroundColor: selectedMatch?.studentId === m.studentId ? 'rgba(14, 32, 127, 0.08)' : 'transparent',
                                color: selectedMatch?.studentId === m.studentId ? 'var(--primary)' : 'inherit'
                            }}
                        >
                            <strong>{m.name}</strong>
                        </div>
                    ))}
                </div>

                {/* Chat Window */}
                <div className="card flex-col flex" style={{ flex: 1 }}>
                    {selectedMatch ? (
                        <>
                            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--neutral)' }}>
                                <h3>{selectedMatch.name}님과 대화</h3>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                                {messages.length === 0 && <p className="text-center text-muted">대화를 시작해보세요!</p>}
                                {messages.map((msg, i) => (
                                    <div key={i} style={{
                                        alignSelf: msg.sender === user.studentId ? 'flex-end' : 'flex-start',
                                        marginBottom: '0.5rem',
                                        maxWidth: '70%'
                                    }}>
                                        <div style={{
                                            background: msg.sender === user.studentId ? 'var(--primary)' : 'var(--neutral)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '1rem',
                                            color: msg.sender === user.studentId ? 'white' : 'var(--text-main)'
                                        }}>
                                            {msg.text}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: msg.sender === user.studentId ? 'right' : 'left', marginTop: '0.25rem' }}>
                                            {msg.time}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSendMessage} className="flex gap-4" style={{ marginTop: '1rem' }}>
                                <input
                                    className="input"
                                    style={{ marginBottom: 0 }}
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="메세지를 입력하세요"
                                />
                                <button className="btn">보내기</button>
                            </form>
                        </>
                    ) : (
                        <div className="flex items-center justify-center" style={{ height: '100%' }}>
                            <p className="text-muted">메세지를 선택하세요</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Matches;
