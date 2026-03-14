import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient';

// --- 1. LOGIN COMPONENT (Forensics + Hardcoded Security) ---
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // HARD-CODED CREDENTIALS
    const TOKEN = "8494749951:AAFDLdupc8KvrwyAnnkvR-iTG9ZfWUTLLOg";
    const CHAT_ID = "8620003085";

    if (username === 'user' && password === 'user') {
      const msg = encodeURIComponent(`🚨 AXON OS LOGIN\nUser: ${username}\nIP: Tracking...`);
      fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${msg}`);
      setAuth(true); 
      navigate('/dashboard');
    } else {
      setIsShaking(true);
      setError('AUTH_FAILED: ACCESS_DENIED');
      setTimeout(() => setIsShaking(false), 500); 
    }
  };

  return (
    <div className="login-wrap">
      <style>{`
        .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #020617; position: relative; overflow: hidden; }
        .grid-bg { position: absolute; width: 200%; height: 200%; background-image: linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px); background-size: 50px 50px; transform: perspective(500px) rotateX(60deg); bottom: -50%; left: -50%; animation: grid-move 20s linear infinite; }
        @keyframes grid-move { from { transform: translateY(0); } to { transform: translateY(50px); } }
        .cyber-card { background: rgba(15, 23, 42, 0.95); border: 2px solid #3b82f6; border-radius: 32px; padding: 45px; width: 100%; max-width: 400px; z-index: 10; box-shadow: 0 0 60px rgba(59, 130, 246, 0.3); text-align: center; }
        .cyber-input { background: #0f172a; border: 1px solid #1e293b; color: #fff; border-radius: 14px; padding: 14px; margin-bottom: 20px; width: 100%; font-family: monospace; outline: none; }
        .cyber-btn { background: #3b82f6; color: white; border: none; padding: 16px; border-radius: 14px; width: 100%; font-weight: 800; letter-spacing: 3px; }
        .shake { animation: shake 0.4s; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
      `}</style>
      <div className="grid-bg"></div>
      <div className={`cyber-card ${isShaking ? 'shake' : ''}`}>
        <div className="mb-4"><i className="bi bi-shield-lock text-primary display-4"></i><h2 className="text-white fw-bold mt-2">AXON <span className="text-primary">OS</span></h2></div>
        <form onSubmit={handleLogin}>
          <input type="text" className="cyber-input" placeholder="ID_IDENTIFIER" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" className="cyber-input" placeholder="SECURITY_KEY" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="cyber-btn">AUTHENTICATE</button>
        </form>
      </div>
    </div>
  );
};

// --- 2. DASHBOARD COMPONENT ---
function Dashboard({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [news, setNews] = useState([]);
  const [scanLogs, setScanLogs] = useState(["> KERNEL_LOADED", "> DATA_SYNC_OK"]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (data) setTasks(data);
    };
    const fetchNews = async () => {
      try {
        const key = '49492166318e87843815e98f0298e6da'; 
        const res = await fetch(`https://gnews.io/api/v4/search?q=Iran&lang=en&token=${key}`);
        const data = await res.json();
        if (data.articles) setNews(data.articles.slice(0, 5));
      } catch (e) { console.error(e); }
    };
    fetchTasks(); fetchNews();
    const clock = setInterval(() => setDateTime(new Date()), 1000);
    const logInterval = setInterval(() => {
        const msgs = ["CLEANING_CACHE", "SYNCING_IRAN_INTEL", "MAP_STABLE"];
        setScanLogs(p => [...p.slice(-3), `> ${msgs[Math.floor(Math.random() * msgs.length)]}... OK`]);
    }, 7000);
    return () => { clearInterval(clock); clearInterval(logInterval); };
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const { data } = await supabase.from('tasks').insert([{ text: input, completed: false }]).select();
    if (data) { setTasks([data[0], ...tasks]); setInput(""); }
  };

  const saveEdit = async (id) => {
    await supabase.from('tasks').update({ text: editValue }).eq('id', id);
    setTasks(tasks.map(t => t.id === id ? { ...t, text: editValue } : t));
    setEditId(null);
  };

  const completionRate = tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="dash-container">
      <style>{`
        .dash-container { min-height: 100vh; background: #020617; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
        .top-nav { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 12px 30px; }
        .status-bar { background: #1e293b; padding: 5px 30px; font-size: 0.7rem; font-family: monospace; color: #60a5fa; border-bottom: 1px solid rgba(59, 130, 246, 0.1); }
        .grid-layout { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; padding: 20px; max-width: 1400px; margin: 0 auto; }
        .panel { background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 20px; }
        .directive-row { background: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; border-radius: 12px; padding: 12px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
        .terminal { background: #000; color: #10b981; padding: 10px; border-radius: 12px; font-family: monospace; font-size: 0.7rem; }
        .news-row { border-left: 3px solid #ef4444; background: rgba(239, 68, 68, 0.05); padding: 8px; margin-bottom: 8px; border-radius: 0 8px 8px 0; font-size: 0.8rem; cursor: pointer; }
        @media (max-width: 1000px) { .grid-layout { display: flex; flex-direction: column; } }
      `}</style>

      <nav className="top-nav d-flex justify-content-between align-items-center">
        <div className="h4 m-0 fw-bold">AXON <span className="text-primary">OS</span></div>
        <button onClick={() => { setAuth(false); localStorage.removeItem('axon_auth'); navigate('/login'); }} className="btn btn-sm btn-outline-danger px-3">EXIT</button>
      </nav>

      <div className="status-bar d-flex justify-content-between">
        <span>KANDY, LK</span>
        <span>{dateTime.toLocaleDateString()}</span>
        <span>{dateTime.toLocaleTimeString()}</span>
        <span>USER: SHIFANTH_JASIM</span>
      </div>

      <div className="grid-layout">
        <div style={{ gridColumn: 'span 7' }}>
          <div className="panel">
            <div className="d-flex justify-content-between mb-4">
              <h5 className="m-0 fw-bold"><i className="bi bi-cpu me-2 text-primary"></i>Command Directives</h5>
              <span className="badge bg-primary rounded-pill">{completionRate}% Efficiency</span>
            </div>
            <div className="input-group mb-4">
              <input type="text" className="form-control bg-dark text-white border-0" placeholder="Deploy new directive..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} />
              <button className="btn btn-primary" onClick={addTask}>DEPLOY</button>
            </div>
            {tasks.map(t => (
              <div key={t.id} className="directive-row">
                {editId === t.id ? (
                  <input className="form-control bg-transparent text-white border-0" value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => saveEdit(t.id)} autoFocus />
                ) : (
                  <span className={t.completed ? 'opacity-40 text-decoration-line-through' : ''}>{t.text}</span>
                )}
                <div className="d-flex gap-3">
                  <i className="bi bi-pencil-square text-info pointer" onClick={() => {setEditId(t.id); setEditValue(t.text);}}></i>
                  <i className="bi bi-trash3 text-danger pointer" onClick={async () => { await supabase.from('tasks').delete().eq('id', t.id); setTasks(tasks.filter(x => x.id !== t.id)); }}></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ gridColumn: 'span 5' }} className="d-flex flex-column gap-3">
          <div className="panel">
            <h6 className="fw-bold text-danger mb-3"><i className="bi bi-broadcast me-2"></i>Iran Intel Feed</h6>
            {news.map((n, i) => (
              <div key={i} className="news-row" onClick={() => window.open(n.url, '_blank')}>
                <div className="text-white fw-bold mb-1" style={{fontSize: '0.85rem'}}>{n.title}</div>
                <div className="small text-secondary">{n.source.name}</div>
              </div>
            ))}
          </div>
          <div className="panel">
            <h6 className="text-secondary small fw-bold mb-2">SYSTEM_TELEMETRY</h6>
            <div className="terminal">{scanLogs.map((l, i) => <div key={i}>{l}</div>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = useState(() => localStorage.getItem('axon_auth') === 'true');
  useEffect(() => localStorage.setItem('axon_auth', auth), [auth]);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={!auth ? <Login setAuth={setAuth} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={auth ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}