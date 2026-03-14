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

// --- UPDATED DASHBOARD COMPONENT ---
function Dashboard({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  
  // --- NEW: BOOK STATES ---
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });

  const [dateTime, setDateTime] = useState(new Date());
  const [news, setNews] = useState([]);
  const [scanLogs, setScanLogs] = useState(["> BOOT_LOADER_OK", "> SESSION_INIT_KANDY_LK"]);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Tasks
      const { data: taskData } = await supabase.from('tasks').select('*').order('id', { ascending: false });
      if (taskData) setTasks(taskData);

      // Fetch Books
      const { data: bookData } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (bookData) setBooks(bookData);
    };

    const fetchNews = async () => {
      try {
        const key = '49492166318e87843815e98f0298e6da'; 
        const res = await fetch(`https://gnews.io/api/v4/search?q=Iran&lang=en&token=${key}`);
        const data = await res.json();
        if (data.articles) setNews(data.articles.slice(0, 3)); 
      } catch (e) { console.error("News API Error", e); }
    };

    fetchData();
    fetchNews();
    const clock = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  // --- NEW: BOOK ACTIONS ---
  const addBook = async () => {
    if (!newBook.title.trim()) return;
    const { data } = await supabase.from('books').insert([newBook]).select();
    if (data) {
      setBooks([data[0], ...books]);
      setNewBook({ title: "", author: "" });
    }
  };

  const updateBookmark = async (id, page) => {
    const val = parseInt(page) || 0;
    await supabase.from('books').update({ current_page: val }).eq('id', id);
    setBooks(books.map(b => b.id === id ? { ...b, current_page: val } : b));
  };

  const deleteBook = async (id) => {
    await supabase.from('books').delete().eq('id', id);
    setBooks(books.filter(b => b.id !== id));
  };

  const completionRate = tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="dash-container">
      <style>{`
        /* ... existing styles ... */
        .book-entry { background: rgba(15, 23, 42, 0.6); border: 1px solid #1e293b; border-radius: 12px; padding: 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        .bookmark-input { width: 70px; background: #020617; border: 1px solid #3b82f6; color: #3b82f6; text-align: center; border-radius: 6px; font-family: monospace; font-weight: bold; }
        .book-meta { font-size: 0.75rem; color: #64748b; }
      `}</style>

      {/* ... Nav and Status Bar ... */}

      <div className="grid-layout">
        {/* COL 1: Directives */}
        <div style={{ gridColumn: 'span 6' }}>
           {/* ... Keep your existing Mission Directives Panel code here ... */}
        </div>

        {/* COL 2: Intel & Library */}
        <div style={{ gridColumn: 'span 6' }} className="d-flex flex-column gap-3">
          
          {/* LIBRARY PANEL */}
          <div className="panel">
            <h5 className="fw-bold text-white mb-3"><i className="bi bi-book-half text-primary me-2"></i>Library Archive</h5>
            <div className="d-flex gap-2 mb-3">
              <input 
                className="form-control form-control-sm bg-dark text-white border-0" 
                placeholder="Book Title" 
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              />
              <input 
                className="form-control form-control-sm bg-dark text-white border-0" 
                placeholder="Author" 
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
              />
              <button className="btn btn-sm btn-primary" onClick={addBook}>ADD</button>
            </div>

            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {books.map(book => (
                <div key={book.id} className="book-entry">
                  <div>
                    <div className="fw-bold text-white small">{book.title}</div>
                    <div className="book-meta">{book.author}</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="small text-secondary">PG</span>
                    <input 
                      type="number" 
                      className="bookmark-input" 
                      value={book.current_page} 
                      onChange={(e) => updateBookmark(book.id, e.target.value)}
                    />
                    <i className="bi bi-trash text-danger pointer ms-2" onClick={() => deleteBook(book.id)}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Existing Intel and Logs below... */}
          <div className="panel">
            <h6 className="fw-bold text-danger mb-3"><i className="bi bi-broadcast"></i> Live Intel</h6>
            {/* ... news mapping ... */}
          </div>
        </div>
      </div>
    </div>
  );
}

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