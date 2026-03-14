import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient';

// --- CONFIGURATION: PERMANENT SECURITY CREDENTIALS ---
const TELEGRAM_TOKEN = "8494749951:AAFDLdupc8KvrwyAnnkvR-iTG9ZfWUTLLOg";
const TELEGRAM_CHAT_ID = "8620003085";

const notify = (title, detail) => {
  const msg = encodeURIComponent(`[AXON_OS] ${title}\n${detail}\nPlatform: ${navigator.platform}`);
  fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${msg}&parse_mode=Markdown`);
};

// --- 1. LOGIN COMPONENT (Biometric Scanning UI) ---
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsScanning(true);
    
    setTimeout(() => {
      if (username === 'user' && password === 'user') {
        notify("✅ AUTHORIZED_LOGIN", `User: ${username}\nRes: ${window.screen.width}x${window.screen.height}`);
        setAuth(true);
        navigate('/dashboard');
      } else {
        notify("🚨 BREACH_ATTEMPT", `Invalid Credentials Entered: ${username}/${password}`);
        setError('UNAUTHORIZED_ID_FAILURE');
        setIsScanning(false);
      }
    }, 1500);
  };

  return (
    <div className="login-gate">
      <style>{`
        .login-gate { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #020617; position: relative; overflow: hidden; font-family: 'Geist Mono', monospace; }
        .grid-bg { position: absolute; width: 200%; height: 200%; background-image: linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px); background-size: 50px 50px; transform: perspective(500px) rotateX(60deg); bottom: -50%; left: -50%; animation: grid-move 20s linear infinite; }
        @keyframes grid-move { from { transform: translateY(0); } to { transform: translateY(50px); } }
        .auth-card { background: rgba(15, 23, 42, 0.95); border: 2px solid #3b82f6; border-radius: 32px; padding: 45px; width: 400px; z-index: 10; box-shadow: 0 0 60px rgba(59, 130, 246, 0.3); text-align: center; }
        .cyber-input { background: #0f172a; border: 1px solid #1e293b; color: #fff; border-radius: 12px; padding: 14px; margin-bottom: 20px; width: 100%; outline: none; transition: 0.3s; }
        .cyber-input:focus { border-color: #3b82f6; box-shadow: 0 0 10px #3b82f6; }
        .auth-btn { background: #3b82f6; color: white; border: none; padding: 16px; border-radius: 12px; width: 100%; font-weight: 800; letter-spacing: 2px; }
      `}</style>
      <div className="grid-bg"></div>
      <div className="auth-card">
        <i className="bi bi-shield-lock-fill text-primary display-4 mb-3 d-block"></i>
        <h2 className="text-white fw-bold mb-5 tracking-tighter">AXON_OS <span className="text-primary">v5.5</span></h2>
        <form onSubmit={handleLogin}>
          <input type="text" className="cyber-input" placeholder="SYS_ID" value={username} onChange={e => setUsername(e.target.value)} disabled={isScanning} />
          <input type="password" className="cyber-input" placeholder="CIPHER_KEY" value={password} onChange={e => setPassword(e.target.value)} disabled={isScanning} />
          {error && <div className="text-danger small mb-3">{error}</div>}
          <button type="submit" className="auth-btn">{isScanning ? 'IDENTIFYING...' : 'INITIALIZE'}</button>
        </form>
      </div>
    </div>
  );
};

// --- 2. DASHBOARD COMPONENT (Command & Control) ---
function Dashboard({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [news, setNews] = useState([]);
  const [logs, setLogs] = useState(["> KERNEL_LOADED", "> NETWORK_STABLE_KANDY"]);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (data) setTasks(data);
    };
    const fetchNews = async () => {
      try {
        const key = '49492166318e87843815e98f0298e6da'; 
        const res = await fetch(`https://gnews.io/api/v4/search?q=Iran&lang=en&token=${key}`);
        const d = await res.json();
        if (d.articles) setNews(d.articles.slice(0, 5));
      } catch (e) { console.error("News offline"); }
    };

    fetchData(); fetchNews();
    const tInterval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tInterval);
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const { data } = await supabase.from('tasks').insert([{ text: input, completed: false }]).select();
    if (data) { setTasks([data[0], ...tasks]); setInput(""); }
  };

  const handleEdit = async (id) => {
    await supabase.from('tasks').update({ text: editValue }).eq('id', id);
    setTasks(tasks.map(t => t.id === id ? { ...t, text: editValue } : t));
    setEditId(null);
  };

  const completion = tasks.length ? Math.round((tasks.filter(x => x.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="dash-container">
      <style>{`
        .dash-container { min-height: 100vh; background: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        .top-nav { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 12px 30px; }
        .status-strip { background: #1e293b; padding: 5px 30px; font-size: 0.7rem; font-family: monospace; color: #60a5fa; border-bottom: 1px solid rgba(59, 130, 246, 0.1); }
        .glass-panel { background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 20px; }
        .directive-card { background: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; border-radius: 12px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
        .news-pill { border-left: 3px solid #ef4444; background: rgba(239, 68, 68, 0.05); padding: 8px; margin-bottom: 8px; border-radius: 0 8px 8px 0; font-size: 0.75rem; cursor: pointer; }
      `}</style>

      <nav className="top-nav d-flex justify-content-between align-items-center">
        <div className="h4 m-0 fw-bold">AXON <span className="text-primary">OS</span></div>
        <div className="d-flex gap-3">
          <button className="btn btn-sm btn-primary px-3" onClick={() => navigate('/reading')}><i className="bi bi-book me-2"></i>READING_HUB</button>
          <button onClick={() => { setAuth(false); localStorage.removeItem('axon_auth'); navigate('/login'); }} className="btn btn-sm btn-outline-danger">DISCONNECT</button>
        </div>
      </nav>

      <div className="status-strip d-flex justify-content-between">
        <span>LOC: KANDY, LK</span>
        <span>DATE: {time.toLocaleDateString()}</span>
        <span>TIME: {time.toLocaleTimeString()}</span>
        <span>USER: SHIFANTH_JASIM</span>
      </div>

      <div className="container-fluid py-4 px-lg-5">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="glass-panel">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0"><i className="bi bi-cpu text-primary me-2"></i>Directives</h5>
                <span className="badge bg-primary px-3">{completion}% Efficiency</span>
              </div>
              <div className="input-group mb-4">
                <input type="text" className="form-control bg-dark text-white border-0" placeholder="Deploy new command..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && addTask()} />
                <button className="btn btn-primary px-4" onClick={addTask}>DEPLOY</button>
              </div>
              {tasks.map(t => (
                <div key={t.id} className="directive-card">
                  {editId === t.id ? (
                    <input className="form-control bg-transparent text-white border-0 p-0" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleEdit(t.id)} autoFocus />
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
          <div className="col-lg-5">
            <div className="glass-panel mb-4">
              <h6 className="fw-bold text-danger mb-3"><i className="bi bi-broadcast me-2"></i>Live Intel: Iran</h6>
              {news.map((n, i) => (
                <div key={i} className="news-pill" onClick={() => window.open(n.url, '_blank')}>
                  <div className="text-white fw-bold mb-1">{n.title}</div>
                  <div className="small text-secondary">{n.source.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. READING HUB COMPONENT (Neural Reconstruction) ---
const ReadingHub = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [newB, setNewB] = useState({ title: '', page: '', note: '' });
  const navigate = useNavigate();
  const quotes = ["Failure is just data.", "Focus is the new currency.", "Rebuild your source code.", "Read to lead."];

  useEffect(() => {
    const fetchB = async () => {
      const { data } = await supabase.from('bookmarks').select('*').order('id', { ascending: false });
      if (data) setBookmarks(data);
    };
    fetchB();
  }, []);

  const saveB = async () => {
    if (!newB.title) return;
    const { data } = await supabase.from('bookmarks').insert([newB]).select();
    if (data) { setBookmarks([data[0], ...bookmarks]); setNewB({ title: '', page: '', note: '' }); }
  };

  return (
    <div className="hub-wrap">
      <style>{`
        .hub-wrap { background: #020617; min-height: 100vh; color: #f8fafc; padding: 40px; position: relative; overflow: hidden; }
        .floating-quote { position: absolute; font-size: 5rem; font-weight: 900; color: rgba(59, 130, 246, 0.03); white-space: nowrap; animation: float 60s linear infinite; pointer-events: none; }
        @keyframes float { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        .glass-box { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 30px; position: relative; z-index: 10; }
        .input-dark { background: #0f172a; border: 1px solid #1e293b; color: white; border-radius: 12px; padding: 12px; margin-bottom: 12px; width: 100%; }
        .btn-hub { background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: bold; width: 100%; }
      `}</style>
      
      {quotes.map((q, i) => <div key={i} className="floating-quote" style={{top: `${i * 25}%`, animationDelay: `${i * 10}s`}}>{q}</div>)}

      <div className="container" style={{maxWidth: '1000px'}}>
        <div className="d-flex justify-content-between align-items-center mb-5" style={{position: 'relative', z-index: 20}}>
          <h1 className="fw-bold"><i className="bi bi-book-half text-primary me-3"></i>Cognitive Hub</h1>
          <button className="btn btn-outline-light px-4" onClick={() => navigate('/dashboard')}>BACK_TO_CORE</button>
        </div>

        <div className="row g-4">
          <div className="col-lg-12">
            <div className="glass-box" style={{borderLeft: '4px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)'}}>
              <h4 className="text-warning fw-bold mb-3">Rebuilding After Failure</h4>
              <p className="text-secondary m-0">Failure is just a system crash. Reading is how you re-install the OS. Every page is a patch. Every book is a kernel update.</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="glass-box">
              <h5 className="fw-bold mb-4">Log Bookmark</h5>
              <input type="text" className="input-dark" placeholder="Book Title" value={newB.title} onChange={e => setNewB({...newB, title: e.target.value})} />
              <input type="number" className="input-dark" placeholder="Page" value={newB.page} onChange={e => setNewB({...newB, page: e.target.value})} />
              <textarea className="input-dark" placeholder="Eureka Moment..." value={newB.note} onChange={e => setNewB({...newB, note: e.target.value})} />
              <button className="btn-hub" onClick={saveB}>SAVE_INSIGHT</button>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="glass-box h-100">
              <h5 className="fw-bold mb-4">Neural Library</h5>
              <div className="row g-3">
                {bookmarks.map((b, i) => (
                  <div key={i} className="col-md-6">
                    <div className="p-3 rounded bg-dark border border-secondary">
                      <div className="d-flex justify-content-between small text-primary mb-2"><span>PG. {b.page}</span><i className="bi bi-bookmark-star"></i></div>
                      <div className="fw-bold mb-1">{b.title}</div>
                      <div className="small text-secondary italic">"{b.note}"</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. MAIN APP ROUTER ---
export default function App() {
  const [auth, setAuth] = useState(() => localStorage.getItem('axon_auth') === 'true');
  useEffect(() => localStorage.setItem('axon_auth', auth), [auth]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!auth ? <Login setAuth={setAuth} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={auth ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" replace />} />
        <Route path="/reading" element={auth ? <ReadingHub /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}