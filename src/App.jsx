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

    // 1. Fetch IP and Location Data
    let ipInfo = { ip: "Unknown", city: "Unknown", region: "Unknown", org: "Unknown" };
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        ipInfo = await response.json();
      }
    } catch (err) {
      console.error("Location lookup failed", err);
    }

    if (username === 'user' && password === 'user') {
      // --- TELEGRAM NOTIFICATION WITH IP & LOC ---
      const token = "8494749951:AAFDLdupc8KvrwyAnnkvR-iTG9ZfWUTLLOg";
      const chat = "8620003085";
      
      const message = encodeURIComponent(
        `🚨 *AXON OS LOGIN DETECTED*\n\n` +
        `👤 *User:* ${username}\n` +
        `🌐 *IP:* ${ipInfo.ip}\n` +
        `📍 *Loc:* ${ipInfo.city}, ${ipInfo.region}\n` +
        `🏢 *ISP:* ${ipInfo.org}\n` +
        `💻 *Dev:* ${window.navigator.platform}\n` +
        `⏰ *Time:* ${new Date().toLocaleTimeString()}`
      );

      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${message}&parse_mode=Markdown`)
        .catch(err => console.error("Telegram error:", err));

      setAuth(true); 
      navigate('/dashboard');
    } else {
      // OPTIONAL: Send a Telegram alert for failed attempts too
      setIsShaking(true);
      setError('Access Denied: Invalid Credentials');
      setTimeout(() => setIsShaking(false), 500); 
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#0f172a' }}>
      <style>{`
        .apple-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 32px; padding: 3rem; width: 100%; max-width: 420px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
        .shake { animation: apple-shake 0.4s ease-in-out; border: 1px solid #ef4444 !important; }
        @keyframes apple-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 50% { transform: translateX(8px); } 75% { transform: translateX(-8px); } }
        .apple-input { background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.1); color: white; border-radius: 14px; padding: 14px 20px; margin-bottom: 15px; }
        .apple-input:focus { background: rgba(255, 255, 255, 0.12); border-color: #6366f1; color: white; box-shadow: none; }
        .apple-btn { background: #6366f1; border: none; border-radius: 14px; padding: 14px; font-weight: 600; width: 100%; margin-top: 10px; }
        .creator-tag { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
      `}</style>

      <div className={`apple-card ${isShaking ? 'shake' : ''}`}>
        <div className="mb-4 text-primary"><i className="bi bi-cpu" style={{ fontSize: '3.5rem' }}></i></div>
        <h2 className="fw-bold text-white mb-1">AXON <span className="text-primary">OS</span></h2>
        <p className="text-secondary small mb-5">Kernel Access Protocol v3.5</p>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" className="form-control apple-input" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" className="form-control apple-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-danger small mb-3">{error}</div>}
          <button type="submit" className="btn btn-primary apple-btn shadow-lg">Authenticate</button>
        </form>
        <div className="creator-tag">
          <div className="small text-secondary text-uppercase mb-1" style={{ fontSize: '0.6rem', letterSpacing: '2px' }}>System Architect</div>
          <div className="fw-bold text-white opacity-75">Shifanth Jasim</div>
          <div className="small text-primary mt-1" style={{ fontSize: '0.65rem' }}>
            <i className="bi bi-patch-check-fill me-1"></i> Software Engineer (Remote)
          </div>
        </div>
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

  const categories = ['Gardening', 'Reading', 'Coding', 'GED'];

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (!error) setTasks(data || []);
      setLoading(false);
    };
    fetchTasks();

    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    const scanInterval = setInterval(() => {
      const cmds = ["SYNCHRONIZING_CLOUD", "ENCRYPTING_QUERY", "OPTIMIZING_NODE", "UPLOADING_METRICS"];
      const newLog = `> ${cmds[Math.floor(Math.random() * cmds.length)]}... OK`;
      setScanLogs(prev => [...prev.slice(-4), newLog]);
    }, 3000);

    return () => { clearInterval(timer); clearInterval(scanInterval); };
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const newTask = { text: input, category, completed: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const { data, error } = await supabase.from('tasks').insert([newTask]).select();
    if (!error && data) { setTasks([data[0], ...tasks]); setInput(""); }
  };

  const toggleTask = async (id, currentStatus) => {
    const { error } = await supabase.from('tasks').update({ completed: !currentStatus }).eq('id', id);
    if (!error) setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = async (id) => {
    const originalTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) { setTasks(originalTasks); alert("Sync Error"); }
  };

  const handleLogout = () => {
    setAuth(false);
    localStorage.removeItem('axon_auth');
    navigate('/login');
  };

  const completionRate = tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        .glass-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; }
        .task-item { transition: all 0.2s ease; border-left: 4px solid transparent; }
        .task-item:hover { background: rgba(255,255,255,0.05); transform: translateX(4px); }
        .task-completed { opacity: 0.5; text-decoration: line-through; }
        .category-pill { font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; background: #6366f1; font-weight: 600; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>

      <nav className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25">
        <div className="d-flex align-items-center gap-2">
          <div className={`rounded-circle ${loading ? 'bg-warning' : 'bg-primary'}`} style={{width: 12, height: 12}}></div>
          <span className="fw-bold">AXON <span className="text-primary">OS</span></span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="small text-secondary d-none d-md-block">{liveTime.toLocaleTimeString()}</span>
          <button onClick={handleLogout} className="btn btn-sm btn-outline-danger shadow-sm" style={{ borderRadius: '10px' }}><i className="bi bi-power"></i></button>
        </div>
      </nav>

      <div className="container py-5" style={{ maxWidth: '700px' }}>
        <div className="mb-4 d-flex justify-content-between align-items-end">
          <div><h2 className="fw-bold mb-1">Productivity</h2><p className="text-secondary small">Authorized: Shifanth</p></div>
          <div className="text-end"><span className="h4 fw-bold text-primary">{completionRate}%</span></div>
        </div>

        <div className="glass-card p-4 mb-4 shadow-lg">
          <div className="input-group mb-3">
            <input type="text" className="form-control bg-transparent border-secondary border-opacity-25 text-white py-2" placeholder="Deploy objective..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} />
            <button className="btn btn-primary px-4" onClick={addTask} style={{ background: '#6366f1', border: 'none' }}><i className="bi bi-cloud-arrow-up"></i></button>
          </div>
          <div className="d-flex gap-2">{categories.map(cat => (<button key={cat} onClick={() => setCategory(cat)} className={`btn btn-sm ${category === cat ? 'btn-light' : 'btn-outline-secondary text-white'}`} style={{ borderRadius: '20px', fontSize: '0.75rem' }}>{cat}</button>))}</div>
        </div>

        <div className="glass-card overflow-hidden shadow-lg">
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {tasks.map((task) => (
              <div key={task.id} className="task-item d-flex align-items-center p-3 border-bottom border-secondary border-opacity-10">
                <div className="me-3" onClick={() => toggleTask(task.id, task.completed)} style={{cursor: 'pointer'}}><i className={`bi ${task.completed ? 'bi-check-circle-fill text-success' : 'bi-circle text-secondary'}`}></i></div>
                <div className="flex-grow-1" style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.5 : 1 }}>
                  <span className="category-pill me-2">{task.category}</span> {task.text}
                </div>
                <button className="btn btn-link text-danger p-0" onClick={() => deleteTask(task.id)}><i className="bi bi-trash3"></i></button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 rounded bg-black bg-opacity-50 border border-secondary border-opacity-10">
          <div className="d-flex align-items-center gap-2 mb-2"><div className="spinner-grow spinner-grow-sm text-primary"></div><span className="small fw-bold text-secondary opacity-75">REMOTE_LOG_STREAM</span></div>
          {scanLogs.map((log, i) => (<div key={i} className="text-success" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{log}</div>))}
        </div>
      </div>
    </div>
  );
}

// --- 3. MAIN ROUTER ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('axon_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('axon_auth', isAuthenticated);
  }, [isAuthenticated]);

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