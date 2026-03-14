import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient';

// --- 1. LOGIN COMPONENT (Forensic Intel + Cyber UI) ---
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === 'user' && password === 'user') {
      const token = "8494749951:AAFDLdupc8KvrwyAnnkvR-iTG9ZfWUTLLOg";
      const chat = "8620003085";
      const msg = encodeURIComponent(`✅ AXON ACCESS: AUTHORIZED\nUser: ${username}\nLoc: Kandy, LK`);
      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${msg}`);
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
        .cyber-card { background: rgba(15, 23, 42, 0.95); border: 2px solid #3b82f6; border-radius: 32px; padding: 45px; width: 100%; max-width: 420px; z-index: 10; box-shadow: 0 0 60px rgba(59, 130, 246, 0.3); }
        .cyber-input { background: #0f172a; border: 1px solid #1e293b; color: #fff; border-radius: 14px; padding: 14px; margin-bottom: 20px; width: 100%; font-family: 'Geist Mono', monospace; outline: none; transition: 0.3s; }
        .cyber-input:focus { border-color: #3b82f6; box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
        .cyber-btn { background: #3b82f6; color: white; border: none; padding: 16px; border-radius: 14px; width: 100%; font-weight: 800; letter-spacing: 3px; transition: 0.4s; }
        .cyber-btn:hover { background: #2563eb; transform: scale(1.02); filter: brightness(1.2); }
        .shake { animation: shake 0.4s; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
      `}</style>
      <div className="grid-bg"></div>
      <div className={`cyber-card ${isShaking ? 'shake' : ''}`}>
        <div className="text-center mb-5"><i className="bi bi-shield-lock text-primary display-4"></i><h2 className="text-white fw-bold mt-2">AXON <span className="text-primary">OS</span></h2><p className="text-secondary small">SECURE KERNEL v4.5</p></div>
        <form onSubmit={handleLogin}>
          <input type="text" className="cyber-input" placeholder="ID_IDENTIFIER" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" className="cyber-input" placeholder="SECURITY_KEY" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="cyber-btn shadow-lg">AUTHENTICATE</button>
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
  const [scanLogs, setScanLogs] = useState(["> BOOT_LOADER_OK", "> SESSION_INIT_KANDY_LK"]);
  const [notes, setNotes] = useState("");
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
      } catch (e) { console.error("News API Error", e); }
    };

    fetchTasks();
    fetchNews();
    const clock = setInterval(() => setDateTime(new Date()), 1000);
    const logInterval = setInterval(() => {
        const msgs = ["CLEANING_CACHE", "UPLOADING_LOGS", "ENCRYPTING_NOTES", "MAP_SYNC_OK"];
        setScanLogs(p => [...p.slice(-3), `> ${msgs[Math.floor(Math.random() * msgs.length)]}... OK`]);
    }, 6000);
    return () => { clearInterval(clock); clearInterval(logInterval); };
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const { data } = await supabase.from('tasks').insert([{ text: input, completed: false }]).select();
    if (data) { setTasks([data[0], ...tasks]); setInput(""); }
  };

  const toggleComplete = async (id, status) => {
    await supabase.from('tasks').update({ completed: !status }).eq('id', id);
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !status } : t));
  };

  const saveEdit = async (id) => {
    await supabase.from('tasks').update({ text: editValue }).eq('id', id);
    setTasks(tasks.map(t => t.id === id ? { ...t, text: editValue } : t));
    setEditId(null);
  };

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completionRate = tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="dash-container">
      <style>{`
        .dash-container { min-height: 100vh; background: #020617; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
        .top-nav { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 12px 30px; position: sticky; top: 0; z-index: 1000; }
        .status-bar { background: #1e293b; padding: 5px 30px; font-size: 0.72rem; font-family: monospace; color: #60a5fa; border-bottom: 1px solid rgba(59, 130, 246, 0.1); }
        .grid-layout { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; padding: 25px; max-width: 1440px; margin: 0 auto; }
        .panel { background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 22px; transition: 0.3s; }
        .panel:hover { border-color: rgba(59, 130, 246, 0.3); box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .directive-row { background: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; border-radius: 14px; padding: 14px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
        .news-row { border-left: 3px solid #ef4444; background: rgba(239, 68, 68, 0.05); padding: 10px; margin-bottom: 12px; border-radius: 0 10px 10px 0; font-size: 0.8rem; cursor: pointer; }
        .terminal { background: #000; color: #10b981; padding: 12px; border-radius: 12px; font-family: monospace; font-size: 0.68rem; line-height: 1.4; }
        .efficiency-pill { background: #3b82f6; color: white; font-weight: 900; padding: 10px 20px; border-radius: 50px; font-size: 1.2rem; }
        .notes-area { background: rgba(0,0,0,0.2); border: 1px solid #1e293b; color: #60a5fa; border-radius: 12px; font-size: 0.8rem; width: 100%; min-height: 120px; padding: 10px; resize: none; }
        @media (max-width: 1024px) { .grid-layout { display: flex; flex-direction: column; } }
      `}</style>

      <nav className="top-nav d-flex justify-content-between align-items-center">
        <div className="h4 m-0 fw-bold">AXON <span className="text-primary">OS</span></div>
        <button onClick={() => { setAuth(false); localStorage.removeItem('axon_auth'); navigate('/login'); }} className="btn btn-sm btn-outline-danger px-4 fw-bold">DISCONNECT</button>
      </nav>

      <div className="status-bar d-flex justify-content-between">
        <span><i className="bi bi-geo-alt"></i> KANDY, CE</span>
        <span><i className="bi bi-calendar3"></i> {dateTime.toLocaleDateString()}</span>
        <span><i className="bi bi-cpu"></i> LOAD: 14%</span>
        <span>USER: SHIFANTH_JASIM</span>
      </div>

      <div className="grid-layout">
        {/* COL 1: Directives (6 Units) */}
        <div style={{ gridColumn: 'span 6' }}>
          <div className="panel">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0 text-white"><i className="bi bi-layers text-primary me-2"></i>Mission Directives</h5>
              <div className="efficiency-pill">{completionRate}%</div>
            </div>
            <div className="input-group mb-4">
              <input type="text" className="form-control bg-dark text-white border-0 py-2" placeholder="Deploy new command..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} />
              <button className="btn btn-primary px-4" onClick={addTask}>DEPLOY</button>
            </div>
            {tasks.map(t => (
              <div key={t.id} className="directive-row">
                <div className="d-flex align-items-center gap-3">
                  <input type="checkbox" checked={t.completed} onChange={() => toggleComplete(t.id, t.completed)} className="form-check-input" />
                  {editId === t.id ? (
                    <input className="form-control bg-transparent text-white border-0 p-0" value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => saveEdit(t.id)} autoFocus />
                  ) : (
                    <span className={t.completed ? 'opacity-40 text-decoration-line-through' : ''}>{t.text}</span>
                  )}
                </div>
                <div className="d-flex gap-3">
                  <i className="bi bi-pencil-square text-info pointer" onClick={() => {setEditId(t.id); setEditValue(t.text);}}></i>
                  <i className="bi bi-trash3 text-danger pointer" onClick={() => deleteTask(t.id)}></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COL 2: Intelligence & Telemetry (6 Units) */}
        <div style={{ gridColumn: 'span 6' }} className="d-flex flex-column gap-3">
          <div className="panel">
            <h6 className="fw-bold text-danger mb-3"><i className="bi bi-broadcast"></i> Live Intel: Iran Situation</h6>
            {news.map((item, i) => (
              <div key={i} className="news-row" onClick={() => window.open(item.url, '_blank')}>
                <div className="fw-bold text-white mb-1">{item.title}</div>
                <div className="small text-secondary">{item.source.name} | {new Date(item.publishedAt).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="panel">
                <h6 className="text-secondary small fw-bold mb-2">SYSTEM_LOGS</h6>
                <div className="terminal">{scanLogs.map((l, i) => <div key={i}>{l}</div>)}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="panel">
                <h6 className="text-secondary small fw-bold mb-2">SCRATCH_PAD</h6>
                <textarea className="notes-area" placeholder="Temporary session notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="row text-center">
              <div className="col-4 border-end border-secondary border-opacity-25"><h6>28°C</h6><p className="small text-secondary m-0">Kandy</p></div>
              <div className="col-4 border-end border-secondary border-opacity-25"><h6>Stable</h6><p className="small text-secondary m-0">Uptime</p></div>
              <div className="col-4"><h6>AES-256</h6><p className="small text-secondary m-0">Security</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. MAIN ROUTER ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('axon_auth') === 'true');
  useEffect(() => { localStorage.setItem('axon_auth', isAuthenticated); }, [isAuthenticated]);

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