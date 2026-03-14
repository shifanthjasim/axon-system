import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient';

// --- 1. LOGIN COMPONENT (With Deep Forensics & Telegram Alerts) ---
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. Gather Hardware Fingerprint
    let gpu = "Unknown";
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    } catch (e) {}

    const forensics = {
      res: `${window.screen.width}x${window.screen.height}`,
      gpu: gpu,
      platform: navigator.platform,
      cores: navigator.hardwareConcurrency || 'N/A'
    };

    // 2. Fetch IP & Network Data
    let net = { ip: "Unknown", city: "Kandy", region: "Central", org: "Unknown" };
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) net = await response.json();
    } catch (err) { console.error("Net lookup failed", err); }

    const token = "8494749951:AAFDLdupc8KvrwyAnnkvR-iTG9ZfWUTLLOg";
    const chat = "8620003085";

    if (username === 'user' && password === 'user') {
      // SUCCESS ALERT
      const message = encodeURIComponent(
        `🔐 *AXON OS: AUTHORIZED ACCESS*\n\n` +
        `👤 *User:* ${username}\n` +
        `🌐 *IP:* ${net.ip}\n` +
        `📍 *Loc:* ${net.city}, ${net.region}\n` +
        `🏢 *ISP:* ${net.org}\n\n` +
        `🖥 *DEVICE SPECS*\n` +
        `💻 *OS:* ${forensics.platform}\n` +
        `🎮 *GPU:* ${forensics.gpu}\n` +
        `⚙️ *CPU:* ${forensics.cores} Cores\n` +
        `📏 *Res:* ${forensics.res}`
      );
      
      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${message}&parse_mode=Markdown`);
      
      setAuth(true); 
      navigate('/dashboard');
    } else {
      // BREACH ALERT (Sends details even if they fail login)
      const breachMsg = encodeURIComponent(
        `⛔️ *AXON OS: BREACH ATTEMPT*\n\n` +
        `🚫 *Tried:* ${username} / ${password}\n` +
        `🌐 *IP:* ${net.ip}\n` +
        `📍 *Loc:* ${net.city}\n` +
        `💻 *Platform:* ${forensics.platform}\n` +
        `🔴 *Status:* ACCESS_DENIED`
      );
      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${breachMsg}&parse_mode=Markdown`);

      setIsShaking(true);
      setError('PROTOCOL_ERR: INVALID_CREDENTIALS');
      setTimeout(() => setIsShaking(false), 500); 
    }
  };

  return (
    <div className="cyber-login">
      <style>{`
        .cyber-login { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #020617; position: relative; overflow: hidden; }
        .grid-bg { position: absolute; width: 200%; height: 200%; background-image: linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px); background-size: 50px 50px; transform: perspective(500px) rotateX(60deg); bottom: -50%; left: -50%; animation: grid-move 20s linear infinite; }
        @keyframes grid-move { from { transform: translateY(0); } to { transform: translateY(50px); } }
        .login-card { background: rgba(15, 23, 42, 0.9); border: 1px solid #3b82f6; border-radius: 24px; padding: 40px; width: 100%; max-width: 400px; z-index: 10; box-shadow: 0 0 30px rgba(59, 130, 246, 0.2); }
        .cyber-label { color: #60a5fa; font-size: 0.7rem; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px; display: block; }
        .cyber-input { background: #0f172a; border: 1px solid #1e293b; color: #fff; border-radius: 12px; padding: 12px; margin-bottom: 20px; width: 100%; font-family: monospace; transition: 0.3s; }
        .cyber-input:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
        .cyber-btn { background: #3b82f6; color: white; border: none; padding: 14px; border-radius: 12px; width: 100%; font-weight: bold; letter-spacing: 2px; }
        .shake { animation: shake 0.4s; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
      `}</style>
      <div className="grid-bg"></div>
      <div className={`login-card ${isShaking ? 'shake' : ''}`}>
        <div className="text-center mb-4">
          <i className="bi bi-cpu text-primary display-5"></i>
          <h2 className="text-white fw-bold mt-2">AXON <span className="text-primary">OS</span></h2>
        </div>
        <form onSubmit={handleLogin}>
          <label className="cyber-label">USER_IDENTIFIER</label>
          <input type="text" className="cyber-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ID..." />
          <label className="cyber-label">SECURITY_PHRASE</label>
          <input type="password" className="cyber-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          {error && <p className="text-danger small">{error}</p>}
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
  const [dateTime, setDateTime] = useState(new Date());
  const [scanLogs, setScanLogs] = useState(["> SYSTEM_BOOT_SUCCESS", "> NODE_CONNECTED"]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (data) setTasks(data);
    };
    fetchTasks();
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    const logTimer = setInterval(() => {
      const msgs = ["SYNC_CLOUD", "ENCRYPT_DB", "SCANNING_NODES", "MAP_GEOLOC"];
      setScanLogs(p => [...p.slice(-3), `> ${msgs[Math.floor(Math.random() * msgs.length)]}... OK`]);
    }, 5000);
    return () => { clearInterval(timer); clearInterval(logTimer); };
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const { data } = await supabase.from('tasks').insert([{ text: input, completed: false }]).select();
    if (data) { setTasks([data[0], ...tasks]); setInput(""); }
  };

  return (
    <div className="dash-container">
      <style>{`
        .dash-container { min-height: 100vh; background: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; }
        .top-nav { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 15px 30px; }
        .status-bar { background: #1e293b; padding: 5px 30px; font-size: 0.7rem; font-family: monospace; color: #60a5fa; border-bottom: 1px solid rgba(59, 130, 246, 0.1); }
        .glass-card { background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; border-radius: 20px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .task-item { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 15px; margin-bottom: 10px; transition: 0.3s; }
        .task-item:hover { border-color: #3b82f6; transform: translateX(5px); }
        .terminal { background: #000; color: #10b981; padding: 15px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 0.75rem; min-height: 100px; }
      `}</style>

      <nav className="top-nav d-flex justify-content-between align-items-center">
        <div className="h4 m-0 fw-bold">AXON <span className="text-primary">OS</span></div>
        <button onClick={() => { setAuth(false); localStorage.removeItem('axon_auth'); navigate('/login'); }} className="btn btn-sm btn-outline-danger">DISCONNECT</button>
      </nav>

      <div className="status-bar d-flex justify-content-between">
        <span>LOC: KANDY, SRI LANKA</span>
        <span>DATE: {dateTime.toLocaleDateString()}</span>
        <span>TIME: {dateTime.toLocaleTimeString()}</span>
        <span>USER: SHIFANTH_JASIM</span>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-8">
            <div className="glass-card">
              <h5 className="mb-4 fw-bold text-white"><i className="bi bi-list-task me-2 text-primary"></i>Command Center</h5>
              <div className="input-group mb-4">
                <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Initialize directive..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} />
                <button className="btn btn-primary px-4" onClick={addTask}>DEPLOY</button>
              </div>
              {tasks.map(t => (
                <div key={t.id} className="task-item d-flex justify-content-between">
                  <span className="text-white">{t.text}</span>
                  <i className="bi bi-shield-check text-primary"></i>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-card mb-4">
              <h6 className="small fw-bold text-secondary mb-3">CORE_LOG_STREAM</h6>
              <div className="terminal">
                {scanLogs.map((l, i) => <div key={i}>{l}</div>)}
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