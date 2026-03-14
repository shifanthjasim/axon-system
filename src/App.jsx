import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient';

// --- 1. LOGIN COMPONENT (Forensics + Cyber UI) ---
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
    <div className="login-container">
      <style>{`
        .login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #020617; }
        .cyber-card { background: rgba(15, 23, 42, 0.9); border: 1px solid #3b82f6; border-radius: 30px; padding: 40px; width: 100%; max-width: 400px; box-shadow: 0 0 40px rgba(59, 130, 246, 0.2); }
        .cyber-input { background: #0f172a; border: 1px solid #1e293b; color: #fff; border-radius: 12px; padding: 12px; margin-bottom: 20px; width: 100%; font-family: monospace; }
        .cyber-btn { background: #3b82f6; color: white; border: none; padding: 14px; border-radius: 12px; width: 100%; font-weight: bold; letter-spacing: 2px; }
        .shake { animation: shake 0.4s; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
      `}</style>
      <div className={`cyber-card ${isShaking ? 'shake' : ''}`}>
        <div className="text-center mb-4"><i className="bi bi-cpu text-primary display-5"></i><h2 className="text-white fw-bold">AXON OS</h2></div>
        <form onSubmit={handleLogin}>
          <input type="text" className="cyber-input" placeholder="IDENTIFIER" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" className="cyber-input" placeholder="PASS_PROTOCOL" value={password} onChange={(e) => setPassword(e.target.value)} />
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
  const [sessionTime, setSessionTime] = useState(0);
  const [news, setNews] = useState([]);
  const [scanLogs, setScanLogs] = useState(["> SYSTEM_BOOT_SUCCESS", "> FETCHING_IRAN_INTEL..."]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (data) setTasks(data);
    };

    const fetchNews = async () => {
      try {
        // Using GNews - works on Vercel without localhost restrictions
        const gnewsKey = '49492166318e87843815e98f0298e6da'; 
        const res = await fetch(`https://gnews.io/api/v4/search?q=Iran&lang=en&token=${gnewsKey}`);
        const data = await res.json();
        if (data.articles) setNews(data.articles.slice(0, 5));
      } catch (e) { console.error("News error", e); }
    };

    fetchTasks();
    fetchNews();
    
    const clock = setInterval(() => setDateTime(new Date()), 1000);
    const session = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    const logInterval = setInterval(() => {
        const msgs = ["ENCRYPTING_DATA", "SYNC_LOCAL_NODE", "MONITORING_IRAN_REPORTS"];
        setScanLogs(p => [...p.slice(-4), `> ${msgs[Math.floor(Math.random() * msgs.length)]}... OK`]);
    }, 6000);

    return () => { clearInterval(clock); clearInterval(session); clearInterval(logInterval); };
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const { data } = await supabase.from('tasks').insert([{ text: input, completed: false }]).select();
    if (data) { setTasks([data[0], ...tasks]); setInput(""); }
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditValue(task.text);
  };

  const saveEdit = async (id) => {
    const { error } = await supabase.from('tasks').update({ text: editValue }).eq('id', id);
    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, text: editValue } : t));
      setEditId(null);
    }
  };

  const toggleComplete = async (id, status) => {
    await supabase.from('tasks').update({ completed: !status }).eq('id', id);
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !status } : t));
  };

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completionRate = tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;
  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="dash-container">
      <style>{`
        .dash-container { min-height: 100vh; background: #020617; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 50px; }
        .top-nav { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 15px 40px; }
        .status-bar { background: #1e293b; padding: 6px 40px; font-size: 0.75rem; font-family: monospace; color: #60a5fa; border-bottom: 1px solid rgba(59, 130, 246, 0.1); }
        .glass-card { background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 25px; height: 100%; transition: 0.3s; }
        .glass-card:hover { border-color: rgba(59, 130, 246, 0.4); box-shadow: 0 0 30px rgba(59, 130, 246, 0.1); }
        .task-item { background: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; border-radius: 16px; padding: 18px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
        .task-done { text-decoration: line-through; opacity: 0.4; }
        .news-pill { border-left: 4px solid #ef4444; background: rgba(239, 68, 68, 0.05); padding: 12px; margin-bottom: 12px; border-radius: 0 12px 12px 0; font-size: 0.85rem; cursor: pointer; transition: 0.2s; }
        .news-pill:hover { background: rgba(239, 68, 68, 0.1); }
        .terminal-box { background: #000; color: #10b981; padding: 15px; border-radius: 12px; font-family: monospace; font-size: 0.7rem; border: 1px solid #1e293b; }
        .stat-circle { width: 60px; height: 60px; border: 3px solid #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
      `}</style>

      <nav className="top-nav d-flex justify-content-between align-items-center">
        <div className="h4 m-0 fw-bold">AXON <span className="text-primary">OS</span></div>
        <div className="d-flex align-items-center gap-4">
          <div className="d-flex align-items-center gap-2 small"><i className="bi bi-clock-history"></i> Session: {formatTime(sessionTime)}</div>
          <button onClick={() => { setAuth(false); localStorage.removeItem('axon_auth'); navigate('/login'); }} className="btn btn-sm btn-outline-danger px-4">LOGOUT</button>
        </div>
      </nav>

      <div className="status-bar d-flex justify-content-between">
        <span><i className="bi bi-geo-alt"></i> KANDY, CE</span>
        <span><i className="bi bi-calendar-event"></i> {dateTime.toLocaleDateString()}</span>
        <span><i className="bi bi-person-badge"></i> SHIFANTH_JASIM</span>
        <span className="text-success"><i className="bi bi-shield-fill-check"></i> KERNEL_ENCRYPTED</span>
      </div>

      <div className="container-fluid py-5 px-lg-5">
        <div className="row g-4">
          {/* Main Directives Hub */}
          <div className="col-lg-6">
            <div className="glass-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">Command Center</h5>
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-secondary">Efficiency:</span>
                  <div className="stat-circle text-primary">{completionRate}%</div>
                </div>
              </div>
              
              <div className="input-group mb-4">
                <input type="text" className="form-control bg-dark text-white border-0 py-2 px-3" placeholder="Initialize new objective..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} />
                <button className="btn btn-primary px-4" onClick={addTask}><i className="bi bi-plus-lg"></i></button>
              </div>

              <div style={{maxHeight: '500px', overflowY: 'auto'}} className="pe-2">
                {tasks.map(t => (
                  <div key={t.id} className="task-item">
                    {editId === t.id ? (
                      <div className="d-flex w-100 gap-2">
                        <input className="form-control bg-transparent text-white border-secondary" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                        <button className="btn btn-sm btn-success" onClick={() => saveEdit(t.id)}>SAVE</button>
                      </div>
                    ) : (
                      <>
                        <div className="d-flex align-items-center gap-3">
                          <input type="checkbox" checked={t.completed} onChange={() => toggleComplete(t.id, t.completed)} className="form-check-input bg-transparent" />
                          <span className={t.completed ? 'task-done' : ''}>{t.text}</span>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-link text-info p-0" onClick={() => startEdit(t)}><i className="bi bi-pencil-square"></i></button>
                          <button className="btn btn-link text-danger p-0" onClick={() => deleteTask(t.id)}><i className="bi bi-trash3"></i></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Iran Intelligence Feed */}
          <div className="col-lg-3">
            <div className="glass-card">
              <h6 className="fw-bold mb-4 text-danger"><i className="bi bi-broadcast"></i> Iran Intel Feed</h6>
              <div style={{maxHeight: '550px', overflowY: 'auto'}} className="pe-2">
                {news.length > 0 ? news.map((item, i) => (
                  <div key={i} className="news-pill" onClick={() => window.open(item.url, '_blank')}>
                    <div className="fw-bold text-white mb-1" style={{fontSize: '0.8rem'}}>{item.title}</div>
                    <div className="small text-secondary">{item.source.name} | {new Date(item.publishedAt).toLocaleTimeString()}</div>
                  </div>
                )) : <div className="text-secondary small italic py-5 text-center">Decrypting stream...</div>}
              </div>
            </div>
          </div>

          {/* Telemetry & Spec Info */}
          <div className="col-lg-3">
            <div className="glass-card mb-4">
              <h6 className="text-secondary small fw-bold mb-3">SYSTEM_TELEMETRY</h6>
              <div className="terminal-box">
                {scanLogs.map((l, i) => <div key={i} className="mb-1">{l}</div>)}
              </div>
            </div>
            
            <div className="glass-card">
              <h6 className="text-secondary small fw-bold mb-3">HARDWARE_FINGERPRINT</h6>
              <div className="small">
                <div className="d-flex justify-content-between mb-2"><span>Platform</span><span className="text-primary">{navigator.platform}</span></div>
                <div className="d-flex justify-content-between mb-2"><span>CPU Cores</span><span className="text-primary">{navigator.hardwareConcurrency}</span></div>
                <div className="d-flex justify-content-between mb-2"><span>Network</span><span className="text-success">Stable</span></div>
                <div className="d-flex justify-content-between"><span>Weather</span><span className="text-info">28°C / Kandy</span></div>
              </div>
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