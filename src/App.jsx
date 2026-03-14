import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient';

// --- 1. LOGIN COMPONENT (Forensics + Telegram) ---
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
      platform: navigator.platform
    };

    let net = { ip: "Unknown", city: "Kandy", region: "Central" };
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) net = await response.json();
    } catch (err) { console.error(err); }

    const token = "8494749951:AAFDLdupc8KvrwyAnnkvR-iTG9ZfWUTLLOg";
    const chat = "8620003085";

    if (username === 'user' && password === 'user') {
      const message = encodeURIComponent(
        `🛰 *AXON OS LOGIN*\n\n👤 *User:* ${username}\n🌐 *IP:* ${net.ip}\n📍 *Loc:* ${net.city}\n🎮 *GPU:* ${forensics.gpu}`
      );
      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${message}&parse_mode=Markdown`);
      setAuth(true); 
      navigate('/dashboard');
    } else {
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
        .cyber-input { background: #0f172a; border: 1px solid #1e293b; color: #fff; border-radius: 12px; padding: 12px; margin-bottom: 20px; width: 100%; font-family: monospace; }
        .cyber-btn { background: #3b82f6; color: white; border: none; padding: 14px; border-radius: 12px; width: 100%; font-weight: bold; }
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
          <input type="text" className="cyber-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="USER_ID" />
          <input type="password" className="cyber-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PASS_CODE" />
          <button type="submit" className="cyber-btn">AUTHENTICATE</button>
        </form>
      </div>
    </div>
  );
};

// --- 2. DASHBOARD COMPONENT (With News Feed) ---
function Dashboard({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [news, setNews] = useState([]);
  const [scanLogs, setScanLogs] = useState(["> SYSTEM_READY", "> TRACKING_IRAN_INTEL..."]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (data) setTasks(data);
    };

    const fetchNews = async () => {
      try {
        // Using a public RSS-to-JSON proxy for live news
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.com/xml/rss/all.xml');
        const data = await res.json();
        // Filter news for "Iran" or take the latest Middle East headlines
        const iranNews = data.items.filter(item => 
          item.title.toLowerCase().includes('iran') || 
          item.description.toLowerCase().includes('iran')
        ).slice(0, 5);
        setNews(iranNews.length > 0 ? iranNews : data.items.slice(0, 5));
      } catch (e) { console.error("News fetch error", e); }
    };

    fetchTasks();
    fetchNews();
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
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
        .status-bar { background: #1e293b; padding: 5px 30px; font-size: 0.7rem; font-family: monospace; color: #60a5fa; }
        .glass-card { background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; border-radius: 20px; padding: 20px; height: 100%; }
        .news-item { border-left: 2px solid #3b82f6; padding-left: 10px; margin-bottom: 15px; font-size: 0.85rem; transition: 0.3s; }
        .news-item:hover { background: rgba(59, 130, 246, 0.1); cursor: pointer; }
        .news-title { font-weight: bold; color: #fff; display: block; }
        .news-date { font-size: 0.7rem; color: #64748b; }
        .terminal { background: #000; color: #10b981; padding: 10px; border-radius: 8px; font-family: monospace; font-size: 0.7rem; }
      `}</style>

      <nav className="top-nav d-flex justify-content-between align-items-center">
        <div className="h4 m-0 fw-bold text-white">AXON <span className="text-primary">OS</span></div>
        <button onClick={() => { setAuth(false); localStorage.removeItem('axon_auth'); navigate('/login'); }} className="btn btn-sm btn-outline-danger">DISCONNECT</button>
      </nav>

      <div className="status-bar d-flex justify-content-between">
        <span>LOC: KANDY, LK</span>
        <span>DATE: {dateTime.toLocaleDateString()}</span>
        <span>TIME: {dateTime.toLocaleTimeString()}</span>
        <span>NEWS_FEED: ACTIVE</span>
      </div>

      <div className="container-fluid py-4 px-4">
        <div className="row g-4">
          {/* Main Tasks Column */}
          <div className="col-lg-5">
            <div className="glass-card">
              <h6 className="fw-bold mb-3 text-white"><i className="bi bi-cpu me-2"></i>Directives</h6>
              <div className="input-group mb-3">
                <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Deploy task..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} />
                <button className="btn btn-primary" onClick={addTask}>+</button>
              </div>
              {tasks.map(t => (
                <div key={t.id} className="p-2 mb-2 bg-dark rounded border border-secondary small">{t.text}</div>
              ))}
            </div>
          </div>

          {/* Iran Live News Column */}
          <div className="col-lg-4">
            <div className="glass-card">
              <h6 className="fw-bold mb-3 text-danger"><i className="bi bi-broadcast me-2"></i>Iran Intel Live</h6>
              <div style={{maxHeight: '450px', overflowY: 'auto'}} className="pe-2">
                {news.length > 0 ? news.map((item, i) => (
                  <div key={i} className="news-item" onClick={() => window.open(item.link, '_blank')}>
                    <span className="news-title">{item.title}</span>
                    <span className="news-date">{item.pubDate}</span>
                  </div>
                )) : <div className="text-secondary small">Fetching latest satellite data...</div>}
              </div>
            </div>
          </div>

          {/* System Logs Column */}
          <div className="col-lg-3">
            <div className="glass-card">
              <h6 className="fw-bold mb-3 text-secondary small">System_Telemetry</h6>
              <div className="terminal mb-3">
                {scanLogs.map((l, i) => <div key={i}>{l}</div>)}
              </div>
              <div className="small text-white-50">
                 <div className="d-flex justify-content-between"><span>User</span><span>Shifanth</span></div>
                 <div className="d-flex justify-content-between"><span>Uptime</span><span>100%</span></div>
                 <div className="d-flex justify-content-between text-success"><span>Network</span><span>Encrypted</span></div>
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