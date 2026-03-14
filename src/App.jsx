import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient';

// --- 1. LOGIN COMPONENT ---
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    let ipInfo = { ip: "Unknown", city: "Unknown" };
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) ipInfo = await res.json();
    } catch (err) { console.error(err); }

    const token = "8494749951:AAFDLdupc8KvrwyAnnkvR-iTG9ZfWUTLLOg";
    const chat = "8620003085";

    if (username === 'user' && password === 'user') {
      const text = encodeURIComponent(`✅ AXON OS: AUTHORIZED\n📍 Loc: ${ipInfo.city}\n💻 Dev: ${window.navigator.platform}`);
      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${text}`);
      setAuth(true);
      navigate('/dashboard', { replace: true });
    } else {
      const fail = encodeURIComponent(`⚠️ AXON OS: DENIED\n👤 Input: ${username}/${password}\n📍 Loc: ${ipInfo.city}`);
      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${fail}`);
      setIsShaking(true);
      setError('Access Denied');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#0f172a' }}>
      <style>{`
        .apple-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 32px; padding: 3rem; width: 100%; max-width: 420px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
        .shake { animation: apple-shake 0.4s ease-in-out; }
        @keyframes apple-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 50% { transform: translateX(8px); } 75% { transform: translateX(-8px); } }
        .apple-input { background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.1); color: white; border-radius: 14px; padding: 14px 20px; margin-bottom: 15px; }
        .apple-btn { background: #6366f1; border: none; border-radius: 14px; padding: 14px; font-weight: 600; width: 100%; color: white; }
      `}</style>
      <div className={`apple-card ${isShaking ? 'shake' : ''}`}>
        <i className="bi bi-cpu text-primary mb-4" style={{ fontSize: '3.5rem' }}></i>
        <h2 className="fw-bold text-white">AXON <span className="text-primary">OS</span></h2>
        <p className="text-secondary small mb-5">System Architect: Shifanth Jasim</p>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" className="form-control apple-input" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" className="form-control apple-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-danger small mb-3">{error}</div>}
          <button type="submit" className="apple-btn">Authenticate</button>
        </form>
      </div>
    </div>
  );
};

// --- 2. DASHBOARD COMPONENT ---
function Dashboard({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Coding");
  const [liveTime, setLiveTime] = useState(new Date());
  const [scanLogs, setScanLogs] = useState(["[SYSTEM] KERNEL_BOOT_SUCCESS..."]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (data) setTasks(data);
      setLoading(false);
    };
    fetchTasks();
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    const s = setInterval(() => {
      const cmds = ["UPLOADING_METRICS", "TUNNEL_STABLE", "AUTH_REFRESHED"];
      setScanLogs(p => [...p.slice(-3), `> ${cmds[Math.floor(Math.random() * cmds.length)]}... OK`]);
    }, 3000);
    return () => { clearInterval(t); clearInterval(s); };
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const newTask = { text: input, category, completed: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const { data } = await supabase.from('tasks').insert([newTask]).select();
    if (data) { setTasks([data[0], ...tasks]); setInput(""); }
  };

  const handleLogout = () => { setAuth(false); localStorage.removeItem('axon_auth'); navigate('/login'); };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
      <nav className="px-4 py-3 d-flex justify-content-between border-bottom border-secondary border-opacity-25">
        <span className="fw-bold">AXON OS</span>
        <button onClick={handleLogout} className="btn btn-sm btn-outline-danger">Logout</button>
      </nav>
      <div className="container py-5" style={{ maxWidth: '700px' }}>
        <div className="p-4 mb-4 shadow-lg" style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="input-group mb-3">
            <input type="text" className="form-control bg-transparent text-white" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} />
            <button className="btn btn-primary" onClick={addTask}>Add</button>
          </div>
        </div>
        <div className="glass-card p-3 shadow-lg" style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px' }}>
          {tasks.map(t => (
            <div key={t.id} className="d-flex p-3 border-bottom border-secondary border-opacity-10">
              <div className="flex-grow-1">{t.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-black bg-opacity-50 rounded">
            {scanLogs.map((l, i) => <div key={i} className="text-success small" style={{fontFamily: 'monospace'}}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}

// --- 3. MAIN APP ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // NULL means "Checking..."

  useEffect(() => {
    const saved = localStorage.getItem('axon_auth');
    setIsAuthenticated(saved === 'true');
  }, []);

  // While checking memory, show a blank dark screen (prevents the Login bounce)
  if (isAuthenticated === null) return <div className="min-vh-100" style={{backgroundColor: '#0f172a'}}></div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard setAuth={setIsAuthenticated} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}