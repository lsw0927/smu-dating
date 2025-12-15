import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RegisterClass from './pages/RegisterClass';
import Discover from './pages/Discover';
import Matches from './pages/Matches';


const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const Home = () => {
  const { user, logout } = useAuth();
  return (
    <div className="container">
      <header className="flex justify-between items-center" style={{ padding: '2rem 0' }}>
        <Link to="/"><img src="/SMU.svg" alt="UniMatch" style={{ height: '40px', width: 'auto' }} /></Link>
        <div className="flex items-center gap-4">
          <Link to="/discover" className="btn btn-secondary">매칭</Link>
          <Link to="/matches" className="btn btn-secondary">메세지</Link>
          <span>{user.name}</span>
          <button className="btn btn-secondary" onClick={logout}>로그아웃</button>
        </div>
      </header>
      <main>
        <div className="card">
          <h2>이번학기 시간표</h2>
          {user.schedule && user.schedule.length > 0 ? (
            <>
              <div style={{ position: 'relative', height: '600px', border: '1px solid var(--neutral)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex' }}>

                {/* Time Column */}
                <div style={{ width: '60px', backgroundColor: '#f9fafb', borderRight: '1px solid var(--neutral)', flexShrink: 0 }}>
                  <div style={{ height: '50px', borderBottom: '1px solid var(--neutral)' }}></div> {/* Header spacer */}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} style={{ height: '60px', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'start', justifyContent: 'center', padding: '4px' }}>
                      {9 + i}:00
                    </div>
                  ))}
                </div>

                {/* Days Columns */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header Row */}
                  <div style={{ height: '50px', display: 'flex', borderBottom: '1px solid var(--neutral)' }}>
                    {['월요일', '화요일', '수요일', '목요일', '금요일'].map((day, i) => (
                      <div key={day} style={{ flex: 1, borderRight: i < 4 ? '1px solid var(--neutral)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Grid Body */}
                  <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                    {/* Vertical Grid Lines */}
                    {['월요일', '화요일', '수요일', '목요일', '금요일'].map((day, i) => (
                      <div key={day} style={{ flex: 1, borderRight: i < 4 ? '1px solid #e5e7eb' : 'none', position: 'relative' }}>
                        {/* Horizontal Hour Lines */}
                        {Array.from({ length: 9 }).map((_, h) => (
                          <div key={h} style={{ height: '60px', borderBottom: '1px solid #f3f4f6', boxSizing: 'border-box' }}></div>
                        ))}

                        {/* Class Blocks */}
                        {user.schedule.filter(c => c.day === day).map((cls, idx) => {
                          const parseTime = (t) => {
                            if (!t) return { h: 9, m: 0 };
                            const [h, m] = t.split(':').map(Number);
                            return { h, m };
                          };
                          const start = parseTime(cls.time);
                          const end = parseTime(cls.endTime || cls.time);

                          let durationMins = (end.h - start.h) * 60 + (end.m - start.m);
                          if (durationMins <= 0) durationMins = 60;

                          const startMinsFrom9 = (start.h - 9) * 60 + start.m;
                          const top = (startMinsFrom9 / (9 * 60)) * 100;
                          const height = (durationMins / (9 * 60)) * 100;

                          return (
                            <div key={idx} style={{
                              position: 'absolute',
                              top: `${top}%`,
                              height: `${height}%`,
                              left: '2px',
                              right: '2px',
                              backgroundColor: 'rgba(14, 32, 127, 0.1)',
                              borderLeft: '3px solid var(--primary)',
                              borderRadius: '4px',
                              padding: '4px',
                              fontSize: '0.7rem',
                              overflow: 'hidden',
                              color: 'var(--primary)',
                              zIndex: 10
                            }}>
                              <div style={{ fontWeight: 'bold' }}>{cls.className}</div>
                              <div>{cls.time} - {cls.endTime}</div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center" style={{ marginTop: '2rem' }}>
                <Link to="/register-class" className="btn btn-secondary">시간표 변경</Link>
              </div>
            </>
          ) : (
            <div className="text-center" style={{ padding: '2rem' }}>
              <p className="mb-4" style={{ color: 'var(--text-muted)' }}>아직 시간표 등록을 하지 않았습니다.</p>
              <Link to="/register-class" className="btn">시간표 등록</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/register-class" element={
            <PrivateRoute>
              <RegisterClass />
            </PrivateRoute>
          } />
          <Route path="/discover" element={
            <PrivateRoute>
              <Discover />
            </PrivateRoute>
          } />
          <Route path="/matches" element={
            <PrivateRoute>
              <Matches />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
