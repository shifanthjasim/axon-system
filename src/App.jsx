import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. IMPORTANT: Make sure these paths match your file names exactly
import Login from './Login'; 
import Dashboard from './Dashboard';
import Library from './Library'; 

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('axon_auth') === 'true'
  );

  // Sync Auth with LocalStorage
  useEffect(() => {
    localStorage.setItem('axon_auth', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard setAuth={setIsAuthenticated} /> : <Navigate to="/login" replace />} 
        />
        
        {/* Library Route */}
        <Route 
          path="/library" 
          element={isAuthenticated ? <Library /> : <Navigate to="/login" replace />} 
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
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
    fetchData();
    const clock = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const { data } = await supabase.from('tasks').insert([{ text: input, completed: false }]).select();
    if (data) { setTasks([data[0], ...tasks]); setInput(""); }
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
        .terminal { background: #000; color: #10b981; padding: 10px; border-radius: 10px; font-size: 0.65rem; font-family: monospace; }
        @media (max-width: 992px) { .grid-layout > div { grid-column: span 12 !important; } }
      `}</style>

      <nav className="top-nav">
        <div className="h4 m-0 fw-bold text-white">AXON <span className="text-primary">OS</span></div>
        <div className="d-flex gap-2">
            <button onClick={() => navigate('/library')} className="btn btn-sm btn-primary px-3 fw-bold">
                <i className="bi bi-book-half me-1"></i> LIBRARY
            </button>
            <button onClick={() => { setAuth(false); navigate('/login'); }} className="btn btn-sm btn-outline-danger">EXIT</button>
        </div>
      </nav>

      <div className="status-bar">
        <span><i className="bi bi-geo-alt"></i> KANDY, CE</span>
        <span>{dateTime.toLocaleTimeString()}</span>
        <span>USER: SHIFANTH_JASIM</span>
      </div>

      <div className="grid-layout">
        <div style={{ gridColumn: 'span 12' }}>
          <div className="panel">
            <h5 className="text-white fw-bold mb-3">Quick Overview</h5>
            <div className="row text-center">
                <div className="col-6 border-end border-secondary border-opacity-25">
                    <h2 className="text-primary fw-bold">{completionRate}%</h2>
                    <p className="small text-secondary m-0">Task Completion</p>
                </div>
                <div className="col-6">
                    <h2 className="text-primary fw-bold">{books.length}</h2>
                    <p className="small text-secondary m-0">Books in Archive</p>
                </div>
            </div>
          </div>
        </div>
        
        <div style={{ gridColumn: 'span 6' }}>
          <div className="panel">
            <h5 className="text-white fw-bold mb-3">Directives</h5>
            <div className="input-group mb-3">
              <input type="text" className="form-control bg-dark text-white border-0" placeholder="New Task..." value={input} onChange={(e)=>setInput(e.target.value)} onKeyPress={(e)=>e.key==='Enter'&&addTask()} />
              <button className="btn btn-primary btn-sm" onClick={addTask}>DEPLOY</button>
            </div>
            {tasks.slice(0, 5).map(t => (
              <div key={t.id} className="book-entry small">
                <span className={t.completed ? 'text-decoration-line-through opacity-50' : ''}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ gridColumn: 'span 6' }}>
            <div className="panel p-3">
                <h6 className="text-secondary small fw-bold mb-2">SYSTEM_LOGS</h6>
                <div className="terminal">{scanLogs.map((l, i) => <div key={i}>{l}</div>)}</div>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. LIBRARY COMPONENT (ADVANCED) ---
function Library() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: "", author: "", total_pages: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false });
        if (data) setBooks(data);
    };

    const addBook = async () => {
        if (!newBook.title.trim()) return;
        const { data } = await supabase.from('books').insert([{
            title: newBook.title,
            author: newBook.author,
            current_page: 0,
            total_pages: parseInt(newBook.total_pages) || 0
        }]).select();
        if (data) { setBooks([data[0], ...books]); setNewBook({ title: "", author: "", total_pages: "" }); }
    };

    const updatePage = async (id, val) => {
        const page = parseInt(val) || 0;
        await supabase.from('books').update({ current_page: page }).eq('id', id);
        setBooks(books.map(b => b.id === id ? { ...b, current_page: page } : b));
    };

    const deleteBook = async (id) => {
        await supabase.from('books').delete().eq('id', id);
        setBooks(books.filter(b => b.id !== id));
    };

    return (
        <div className="dash-container">
            <style>{`
                .lib-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; padding: 20px; }
                .progress-bar-bg { background: #0f172a; height: 6px; border-radius: 10px; margin: 10px 0; }
                .progress-fill { background: #3b82f6; height: 100%; border-radius: 10px; box-shadow: 0 0 8px #3b82f6; transition: 0.4s; }
            `}</style>
            <nav className="top-nav">
                <div className="h4 m-0 fw-bold">AXON <span className="text-primary">LIBRARY</span></div>
                <button onClick={() => navigate('/dashboard')} className="btn btn-sm btn-outline-primary">DASHBOARD</button>
            </nav>
            <div className="container mt-4">
                <div className="panel mb-4">
                    <div className="row g-2">
                        <div className="col-md-5"><input className="form-control bg-dark text-white border-0" placeholder="Book Title" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} /></div>
                        <div className="col-md-4"><input className="form-control bg-dark text-white border-0" placeholder="Author" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} /></div>
                        <div className="col-md-2"><input type="number" className="form-control bg-dark text-white border-0" placeholder="Pgs" value={newBook.total_pages} onChange={e => setNewBook({...newBook, total_pages: e.target.value})} /></div>
                        <div className="col-md-1"><button className="btn btn-primary w-100" onClick={addBook}>ADD</button></div>
                    </div>
                </div>
                <div className="lib-grid">
                    {books.map(book => {
                        const progress = book.total_pages ? Math.min(Math.round((book.current_page / book.total_pages) * 100), 100) : 0;
                        return (
                            <div key={book.id} className="panel">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div><h6 className="text-white m-0">{book.title}</h6><small className="text-secondary">{book.author}</small></div>
                                    <i className="bi bi-x-circle text-danger pointer" onClick={() => deleteBook(book.id)}></i>
                                </div>
                                <div className="progress-bar-bg"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
                                <div className="d-flex justify-content-between align-items-center mt-2 small">
                                    <span className="text-primary fw-bold">{progress}%</span>
                                    <div className="d-flex align-items-center gap-1">
                                        <input type="number" className="bookmark-input" value={book.current_page} onChange={(e) => updatePage(book.id, e.target.value)} style={{width:'45px'}} />
                                        <span className="text-secondary">/ {book.total_pages}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

// --- 4. MAIN ROUTER ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('axon_auth') === 'true');
  useEffect(() => { localStorage.setItem('axon_auth', isAuthenticated); }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard setAuth={setIsAuthenticated} /> : <Navigate to="/login" replace />} />
        <Route path="/library" element={isAuthenticated ? <Library /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}