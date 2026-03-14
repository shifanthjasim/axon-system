import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient';

// --- 1. LOGIN COMPONENT ---
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      setTimeout(() => setIsShaking(false), 500); 
    }
  };

  return (
    <div className="login-wrap">
      <style>{`
        .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #020617; position: relative; overflow: hidden; padding: 20px; }
        .grid-bg { position: absolute; width: 200%; height: 200%; background-image: linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px); background-size: 50px 50px; transform: perspective(500px) rotateX(60deg); bottom: -50%; left: -50%; animation: grid-move 20s linear infinite; }
        @keyframes grid-move { from { transform: translateY(0); } to { transform: translateY(50px); } }
        .cyber-card { background: rgba(15, 23, 42, 0.95); border: 2px solid #3b82f6; border-radius: 32px; padding: 40px; width: 100%; max-width: 420px; z-index: 10; box-shadow: 0 0 60px rgba(59, 130, 246, 0.3); }
        .cyber-input { background: #0f172a; border: 1px solid #1e293b; color: #fff; border-radius: 14px; padding: 14px; margin-bottom: 20px; width: 100%; font-family: monospace; outline: none; }
        .cyber-btn { background: #3b82f6; color: white; border: none; padding: 16px; border-radius: 14px; width: 100%; font-weight: 800; letter-spacing: 3px; }
        @media (max-width: 576px) { .cyber-card { padding: 25px; border-radius: 20px; } }
        .shake { animation: shake 0.4s; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
      `}</style>
      <div className="grid-bg"></div>
      <div className={`cyber-card ${isShaking ? 'shake' : ''}`}>
        <div className="text-center mb-5"><i className="bi bi-shield-lock text-primary display-4"></i><h2 className="text-white fw-bold mt-2">AXON <span className="text-primary">OS</span></h2></div>
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
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });
  const [news, setNews] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());
  const [scanLogs] = useState(["> BOOT_LOADER_OK", "> SESSION_INIT_KANDY_LK"]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: tData } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (tData) setTasks(tData);
      const { data: bData } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (bData) setBooks(bData);
    };

    const fetchNews = async () => {
      try {
        const res = await fetch(`https://gnews.io/api/v4/search?q=Iran&lang=en&token=49492166318e87843815e98f0298e6da`);
        const data = await res.json();
        if (data.articles) setNews(data.articles.slice(0, 3));
      } catch (e) { console.error(e); }
    };

    fetchData();
    fetchNews();
    const clock = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const { data } = await supabase.from('tasks').insert([{ text: input, completed: false }]).select();
    if (data) { setTasks([data[0], ...tasks]); setInput(""); }
  };

  const addBook = async () => {
    if (!newBook.title.trim()) return;
    const { data } = await supabase.from('books').insert([newBook]).select();
    if (data) { setBooks([data[0], ...books]); setNewBook({ title: "", author: "" }); }
  };

  const updateBookmark = async (id, page) => {
    const val = parseInt(page) || 0;
    await supabase.from('books').update({ current_page: val }).eq('id', id);
    setBooks(books.map(b => b.id === id ? { ...b, current_page: val } : b));
  };

  const completionRate = tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="dash-container">
      <style>{`
        .dash-container { min-height: 100vh; background: #020617; color: #f8fafc; font-family: sans-serif; padding-bottom: 30px; }
        .top-nav { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
        .status-bar { background: #1e293b; padding: 5px 20px; font-size: 0.65rem; color: #60a5fa; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .grid-layout { display: grid; grid-template-columns: repeat(12, 1fr); gap: 15px; padding: 15px; max-width: 1400px; margin: 0 auto; }
        .panel { background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 18px; height: 100%; }
        .book-entry { background: rgba(15, 23, 42, 0.6); border: 1px solid #1e293b; border-radius: 12px; padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .bookmark-input { width: 50px; background: #000; border: 1px solid #3b82f6; color: #3b82f6; text-align: center; border-radius: 4px; font-weight: bold; font-size: 0.8rem; }
        .terminal { background: #000; color: #10b981; padding: 10px; border-radius: 10px; font-size: 0.65rem; font-family: monospace; }
        
        /* RESPONSIVE OVERRIDES */
        @media (max-width: 992px) {
          .grid-layout > div { grid-column: span 12 !important; }
          .top-nav .h4 { font-size: 1.2rem; }
        }
        @media (max-width: 576px) {
          .status-bar span:nth-child(3) { display: none; } /* Hide user on tiny screens */
          .grid-layout { padding: 10px; }
          .panel { padding: 15px; }
        }
      `}</style>

      <nav className="top-nav">
        <div className="h4 m-0 fw-bold text-white">AXON <span className="text-primary">OS</span></div>
        <button onClick={() => { setAuth(false); navigate('/login'); }} className="btn btn-sm btn-outline-danger">EXIT</button>
      </nav>

      <div className="status-bar">
        <span><i className="bi bi-geo-alt"></i> KANDY, CE</span>
        <span>{dateTime.toLocaleTimeString()}</span>
        <span>USER: SHIFANTH_JASIM</span>
      </div>

      <div className="grid-layout">
        {/* COL 1: Directives */}
        <div style={{ gridColumn: 'span 6' }}>
          <div className="panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold m-0" style={{fontSize: '1.1rem'}}>Mission Directives</h5>
              <span className="badge bg-primary rounded-pill">{completionRate}%</span>
            </div>
            <div className="input-group mb-3">
              <input type="text" className="form-control bg-dark text-white border-0" placeholder="New Command..." value={input} onChange={(e)=>setInput(e.target.value)} onKeyPress={(e)=>e.key==='Enter'&&addTask()} />
              <button className="btn btn-primary btn-sm" onClick={addTask}>DEPLOY</button>
            </div>
            {tasks.map(t => (
              <div key={t.id} className="book-entry">
                <div className="d-flex align-items-center gap-2 overflow-hidden">
                  <input type="checkbox" checked={t.completed} onChange={()=> {
                    supabase.from('tasks').update({ completed: !t.completed }).eq('id', t.id).then(() => {
                      setTasks(tasks.map(x => x.id === t.id ? {...x, completed: !t.completed} : x))
                    })
                  }} />
                  <span className={`text-truncate ${t.completed ? 'text-decoration-line-through opacity-50' : ''}`} style={{fontSize: '0.9rem'}}>{t.text}</span>
                </div>
                <i className="bi bi-trash text-danger pointer" onClick={()=>supabase.from('tasks').delete().eq('id', t.id).then(()=>setTasks(tasks.filter(x=>x.id!==t.id)))}></i>
              </div>
            ))}
          </div>
        </div>

        {/* COL 2: Library & Intel */}
        <div style={{ gridColumn: 'span 6' }} className="d-flex flex-column gap-3">
          <div className="panel">
            <h5 className="text-white mb-3" style={{fontSize: '1.1rem'}}><i className="bi bi-book-half text-primary me-2"></i>Library</h5>
            <div className="d-flex gap-2 mb-3">
              <input className="form-control form-control-sm bg-dark text-white border-0" placeholder="Title" value={newBook.title} onChange={(e)=>setNewBook({...newBook, title:e.target.value})} />
              <button className="btn btn-sm btn-primary" onClick={addBook}>ADD</button>
            </div>
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {books.map(b => (
                <div key={b.id} className="book-entry">
                  <div className="text-truncate"><div className="fw-bold text-white small text-truncate">{b.title}</div></div>
                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    <span className="small text-primary" style={{fontSize:'0.6rem'}}>PG</span>
                    <input type="number" className="bookmark-input" value={b.current_page} onChange={(e)=>updateBookmark(b.id, e.target.value)} />
                    <i className="bi bi-x-circle text-danger pointer" onClick={() => {
                        supabase.from('books').delete().eq('id', b.id).then(() => setBooks(books.filter(x => x.id !== b.id)))
                    }}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h6 className="text-danger fw-bold mb-3 small"><i className="bi bi-broadcast"></i> Live Intel</h6>
            {news.map((n, i) => (
              <div key={i} className="mb-2 small border-start border-danger ps-2" style={{cursor:'pointer'}} onClick={()=>window.open(n.url, '_blank')}>
                <div className="text-white text-truncate" style={{fontSize: '0.8rem'}}>{n.title}</div>
              </div>
            ))}
          </div>

          <div className="panel">
            <h6 className="text-secondary small fw-bold mb-2">SYSTEM_LOGS</h6>
            <div className="terminal">{scanLogs.map((l, i) => <div key={i}>{l}</div>)}</div>
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