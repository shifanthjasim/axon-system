import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient';

// --- UTILITY: TELEGRAM REPORTER ---
const reportToTelegram = (status, user, detail = "") => {
  const TOKEN = "8494749951:AAFDLdupc8KvrwyAnnkvR-iTG9ZfWUTLLOg";
  const CHAT = "8620003085";
  const msg = encodeURIComponent(`[AXON_LOG] ${status}\nUSER: ${user}\nDEVICE: ${navigator.platform}\nDETAIL: ${detail}`);
  fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT}&text=${msg}&parse_mode=Markdown`);
};

// --- 1. LOGIN COMPONENT (Biometric Logic) ---
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsScanning(true);
    
    // Simulate biometric delay
    setTimeout(() => {
      if (username === 'user' && password === 'user') {
        reportToTelegram("✅ AUTHORIZED_ACCESS", username, "Kernel Boot Sequence Started");
        setAuth(true);
        navigate('/dashboard');
      } else {
        reportToTelegram("🚨 BREACH_ATTEMPT", username, `PW_ENTRY: ${password}`);
        setError('UNAUTHORIZED_ACCESS_ID');
        setIsScanning(false);
      }
    }, 1500);
  };

  return (
    <div className="login-gate">
      <style>{`
        .login-gate { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #020617; position: relative; overflow: hidden; font-family: 'Geist Mono', monospace; }
        .scanner-line { position: absolute; width: 100%; height: 2px; background: rgba(59, 130, 246, 0.5); box-shadow: 0 0 15px #3b82f6; top: 0; left: 0; animation: scan 3s linear infinite; z-index: 5; }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .auth-card { background: rgba(15, 23, 42, 0.9); border: 1px solid #1e3a8a; border-radius: 20px; padding: 40px; width: 380px; z-index: 10; backdrop-filter: blur(10px); box-shadow: 0 0 50px rgba(0,0,0,0.8); }
        .cyber-input { background: #0f172a; border: 1px solid #1e40af; color: #3b82f6; border-radius: 8px; padding: 12px; margin-bottom: 15px; width: 100%; outline: none; }
        .auth-btn { background: #1e40af; color: white; border: none; padding: 14px; width: 100%; border-radius: 8px; font-weight: bold; letter-spacing: 2px; transition: 0.3s; }
        .auth-btn:hover { background: #2563eb; box-shadow: 0 0 20px #3b82f6; }
      `}</style>
      <div className="scanner-line"></div>
      <div className="auth-card">
        <div className="text-center mb-4">
          <i className="bi bi-fingerprint text-primary display-4"></i>
          <h3 className="text-white fw-bold mt-2 tracking-tighter">AXON_OS <span className="text-primary">v5.0</span></h3>
        </div>
        <form onSubmit={handleLogin}>
          <input type="text" className="cyber-input" placeholder="SYS_USER_ID" value={username} onChange={e => setUsername(e.target.value)} disabled={isScanning} />
          <input type="password" className="cyber-input" placeholder="CIPHER_KEY" value={password} onChange={e => setPassword(e.target.value)} disabled={isScanning} />
          {error && <div className="text-danger small mb-3">{error}</div>}
          <button type="submit" className="auth-btn">{isScanning ? 'IDENTIFYING...' : 'INIT_SESSION'}</button>
        </form>
      </div>
    </div>
  );
};

// --- 2. DASHBOARD COMPONENT ---
function Dashboard({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [news, setNews] = useState([]);
  const [logs, setLogs] = useState(["[SYSTEM] KERNEL_LOADED", "[NETWORK] KANDY_SERVER_SYNC_OK"]);
  const [uptime, setUptime] = useState(0);
  const [vault, setVault] = useState("// Secure Code Storage\nconst axon = 'v5.0';");
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Fetch Supabase Data
    const init = async () => {
      const { data } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (data) setTasks(data);
    };

    // 2. Intelligence Feed (IranFocus)
    const getIntel = async () => {
      try {
        const key = '49492166318e87843815e98f0298e6da'; 
        const res = await fetch(`https://gnews.io/api/v4/search?q=Iran&lang=en&token=${key}`);
        const d = await res.json();
        if (d.articles) setNews(d.articles.slice(0, 5));
      } catch (e) { console.error("Intel Feed Error"); }
    };

    init(); getIntel();
    const upTimer = setInterval(() => setUptime(p => p + 1), 1000);
    const logGen = setInterval(() => {
      const types = ["INFO", "WARN", "SEC"];
      const acts = ["QUERY_ENCRYPTED", "GEO_SYNC", "MEM_OPTIMIZE", "SUPABASE_PUSH"];
      const newLog = `[${types[Math.floor(Math.random()*3)]}] ${acts[Math.floor(Math.random()*4)]}`;
      setLogs(p => [...p.slice(-5), newLog]);
    }, 5000);

    return () => { clearInterval(upTimer); clearInterval(logGen); };
  }, []);

  const handleAction = async (type, id = null) => {
    if (type === 'add' && input.trim()) {
      const { data } = await supabase.from('tasks').insert([{ text: input, completed: false }]).select();
      if (data) { setTasks([data[0], ...tasks]); setInput(""); }
    } else if (type === 'delete') {
      await supabase.from('tasks').delete().eq('id', id);
      setTasks(tasks.filter(t => t.id !== id));
    } else if (type === 'logout') {
      reportToTelegram("🏁 SESSION_TERMINATED", "Shifanth");
      setAuth(false); navigate('/login');
    }
  };

  return (
    <div className="axon-dashboard">
      <style>{`
        .axon-dashboard { min-height: 100vh; background: #010409; color: #e6edf3; font-family: 'Plus Jakarta Sans', sans-serif; padding: 0; }
        .top-bar { background: #0d1117; border-bottom: 1px solid #30363d; padding: 10px 25px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .status-strip { background: #161b22; font-family: monospace; font-size: 0.7rem; color: #58a6ff; padding: 4px 25px; border-bottom: 1px solid #30363d; display: flex; justify-content: space-between; }
        .main-grid { display: grid; grid-template-columns: 300px 1fr 350px; height: calc(100vh - 80px); overflow: hidden; }
        .side-col { background: #0d1117; border-right: 1px solid #30363d; padding: 20px; overflow-y: auto; }
        .right-col { border-left: 1px solid #30363d; padding: 20px; overflow-y: auto; background: #0d1117; }
        .center-col { padding: 25px; overflow-y: auto; }
        .panel-card { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 18px; margin-bottom: 20px; }
        .directive-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #0d1117; border: 1px solid #30363d; border-radius: 8px; margin-bottom: 10px; }
        .news-card { border-left: 3px solid #f85149; background: #21262d; padding: 12px; border-radius: 4px; margin-bottom: 12px; font-size: 0.8rem; cursor: pointer; transition: 0.2s; }
        .news-card:hover { transform: scale(1.02); }
        .terminal { background: #000; color: #39ff14; font-family: monospace; font-size: 0.7rem; padding: 10px; border-radius: 6px; border: 1px solid #30363d; }
        .vault-area { background: #000; border: 1px solid #30363d; color: #8b949e; font-family: monospace; width: 100%; height: 150px; font-size: 0.75rem; padding: 10px; resize: none; border-radius: 6px; }
        .badge-live { animation: pulse 2s infinite; background: #238636; color: white; font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        @media (max-width: 1200px) { .main-grid { grid-template-columns: 1fr; } .side-col, .right-col { display: none; } }
      `}</style>

      <nav className="top-bar">
        <div className="d-flex align-items-center gap-2">
          <div className="h4 m-0 fw-bold">AXON <span className="text-primary">OS</span></div>
          <span className="badge-live">SECURE</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="small text-secondary"><i className="bi bi-stopwatch"></i> {Math.floor(uptime/60)}m {uptime%60}s</div>
          <button onClick={() => handleAction('logout')} className="btn btn-sm btn-outline-danger px-3 border-0"><i className="bi bi-power"></i> EXIT</button>
        </div>
      </nav>

      <div className="status-strip">
        <span>LOC: KANDY, CE [7.2906° N, 80.6337° E]</span>
        <span>NODE: SUPABASE_CLOUD_SYST</span>
        <span>WEATHER: 29°C CLEAR_SKIES</span>
        <span>IDENT: SHIFANTH_JASIM_UID_8620</span>
      </div>

      <div className="main-grid">
        {/* SIDEBAR: System Intel */}
        <aside className="side-col">
          <h6 className="text-secondary small fw-bold mb-3 uppercase">Intelligence_Brief</h6>
          {news.map((n, i) => (
            <div key={i} className="news-card" onClick={() => window.open(n.url, '_blank')}>
              <div className="text-white fw-bold mb-1">{n.title}</div>
              <div className="text-secondary" style={{fontSize: '0.65rem'}}>{n.source.name}</div>
            </div>
          ))}
          <hr className="border-secondary opacity-25" />
          <h6 className="text-secondary small fw-bold mb-3 uppercase">Session_Telemetry</h6>
          <div className="terminal">
            {logs.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </aside>

        {/* CENTER: Operations */}
        <main className="center-col">
          <div className="panel-card">
            <h5 className="mb-4"><i className="bi bi-layers text-primary me-2"></i>Mission Directives</h5>
            <div className="input-group mb-4">
              <input type="text" className="form-control bg-dark text-white border-0 py-2" placeholder="Input New Directive..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAction('add')} />
              <button className="btn btn-primary" onClick={() => handleAction('add')}><i className="bi bi-plus-lg"></i> DEPLOY</button>
            </div>
            {tasks.map(t => (
              <div key={t.id} className="directive-item">
                <div className="d-flex align-items-center gap-3">
                  <div className={`rounded-circle ${t.completed ? 'bg-success' : 'bg-primary'}`} style={{width: 8, height: 8}}></div>
                  <span className={t.completed ? 'text-secondary text-decoration-line-through' : 'text-white'}>{t.text}</span>
                </div>
                <div className="d-flex gap-3 text-secondary small">
                  <i className="bi bi-trash pointer hover-red" onClick={() => handleAction('delete', t.id)}></i>
                </div>
              </div>
            ))}
          </div>
          
          <div className="row g-3">
            <div className="col-md-6">
              <div className="panel-card h-100">
                <h6 className="text-secondary small fw-bold mb-3"><i className="bi bi-code-square me-2"></i>Vault_Scratchpad</h6>
                <textarea className="vault-area" value={vault} onChange={e => setVault(e.target.value)} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="panel-card h-100">
                <h6 className="text-secondary small fw-bold mb-3"><i className="bi bi-activity me-2"></i>Efficiency_Matrix</h6>
                <div className="display-5 fw-bold text-primary">{Math.round((tasks.filter(x=>x.completed).length / (tasks.length || 1)) * 100)}%</div>
                <p className="text-secondary small mt-1">Operational Completion Rate</p>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: Quick Links & Environment */}
        <aside className="right-col">
          <h6 className="text-secondary small fw-bold mb-3 uppercase">Environment_Status</h6>
          <div className="panel-card mb-3">
             <div className="small text-secondary mb-2">NETWORK_STRENGTH</div>
             <div className="progress bg-dark" style={{height: 4}}><div className="progress-bar bg-success" style={{width: '94%'}}></div></div>
          </div>
          <div className="panel-card mb-3">
             <div className="small text-secondary mb-2">QUICK_LAUNCH</div>
             <div className="d-grid gap-2">
                <button className="btn btn-sm btn-dark text-start" onClick={() => window.open('https://github.com')}><i className="bi bi-github me-2"></i> GitHub_Repos</button>
                <button className="btn btn-sm btn-dark text-start" onClick={() => window.open('https://supabase.com')}><i className="bi bi-database me-2"></i> Supabase_DB</button>
                <button className="btn btn-sm btn-dark text-start" onClick={() => window.open('https://vercel.com')}><i className="bi bi-triangle me-2"></i> Vercel_Deploy</button>
             </div>
          </div>
          <div className="panel-card text-center p-4">
             <div className="text-secondary small mb-1 uppercase">Local_Time_Kandy</div>
             <div className="h2 fw-bold text-white mb-0">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
             <div className="text-primary small fw-bold">GMT +5:30</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// --- 3. MAIN ROUTER ---
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