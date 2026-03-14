import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from './supabaseClient'; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Coding");
  const [liveTime, setLiveTime] = useState(new Date());
  const [scanLogs, setScanLogs] = useState(["[SYSTEM] KERNEL_BOOT_SUCCESS..."]);
  const [loading, setLoading] = useState(true);

  const categories = ['Gardening', 'Reading', 'Coding', 'GED'];

  // 1. LOAD DATA
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data || []);
      }
      setLoading(false);
    };

    fetchTasks();

    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    const scanInterval = setInterval(() => {
      const cmds = ["SYNCHRONIZING_CLOUD", "ENCRYPTING_QUERY", "OPTIMIZING_NODE", "UPLOADING_METRICS", "TUNNEL_STABLE", "AUTH_REFRESHED"];
      const newLog = `> ${cmds[Math.floor(Math.random() * cmds.length)]}... OK`;
      setScanLogs(prev => [...prev.slice(-4), newLog]);
    }, 3000);

    return () => { clearInterval(timer); clearInterval(scanInterval); };
  }, []);

  // 2. ADD TASK
  const addTask = async () => {
    if (!input.trim()) return;
    const newTask = {
      text: input,
      category,
      completed: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const { data, error } = await supabase.from('tasks').insert([newTask]).select();

    if (error) {
      console.error('Error adding task:', error);
    } else if (data) {
      setTasks([data[0], ...tasks]);
      setInput("");
    }
  };

  // 3. TOGGLE (Updated with Error Handling)
  const toggleTask = async (id, currentStatus) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
      alert("Cloud Sync Failed: Could not update task.");
    } else {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  };

  // 4. DELETE (The Fix: Added Alert if Cloud fails)
  const deleteTask = async (id) => {
    // Optimistic Update: Remove from UI immediately so it feels fast
    const originalTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      // If cloud fails, put the task back in the UI so user knows it didn't delete
      setTasks(originalTasks);
      alert("Cloud Sync Error: Task could not be deleted from server. Check your Supabase RLS policies.");
    }
  };

  const completionRate = tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ 
      backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <style>{`
        .glass-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; }
        .task-item { transition: all 0.2s ease; border-left: 4px solid transparent; }
        .task-item:hover { background: rgba(255,255,255,0.05); transform: translateX(4px); }
        .task-completed { opacity: 0.5; text-decoration: line-through; }
        .category-pill { font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; background: #6366f1; font-weight: 600; }
        .btn-primary-axon { background: #6366f1; border: none; border-radius: 8px; transition: 0.3s; }
        .btn-primary-axon:hover { background: #4f46e5; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>

      <nav className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25">
        <div className="d-flex align-items-center gap-2">
          <div className={`rounded-circle ${loading ? 'bg-warning' : 'bg-primary'}`} style={{width: 12, height: 12}}></div>
          <span className="fw-bold tracking-tighter">AXON <span className="text-primary">OS</span></span>
        </div>
        <div className="small text-secondary">{loading ? "SYNCING..." : "CLOUD_CONNECTED"} | {liveTime.toLocaleTimeString()}</div>
      </nav>

      <div className="container py-5" style={{ maxWidth: '700px' }}>
        <div className="mb-4 d-flex justify-content-between align-items-end">
          <div>
            <h2 className="fw-bold mb-1">Productivity</h2>
            <p className="text-secondary small">Session: Shifanth</p>
          </div>
          <div className="text-end">
            <span className="h4 fw-bold text-primary">{completionRate}%</span>
            <div className="small text-secondary text-uppercase" style={{fontSize: '0.6rem', letterSpacing: '1px'}}>Efficiency</div>
          </div>
        </div>

        <div className="glass-card p-4 mb-4 shadow-lg">
          <div className="input-group mb-3">
            <input type="text" className="form-control bg-transparent border-secondary border-opacity-25 text-white py-2" placeholder="Deploy new objective..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} style={{ borderRadius: '8px 0 0 8px' }} />
            <button className="btn btn-primary-axon px-4" onClick={addTask}><i className="bi bi-cloud-arrow-up"></i></button>
          </div>
          <div className="d-flex gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`btn btn-sm ${category === cat ? 'btn-light' : 'btn-outline-secondary text-white'}`} style={{ borderRadius: '20px', fontSize: '0.75rem' }}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="glass-card overflow-hidden shadow-lg">
          <div className="p-3 border-bottom border-secondary border-opacity-10 d-flex justify-content-between">
            <span className="small fw-bold text-secondary">ACTIVE OPERATIONS</span>
            <span className="small text-secondary">{tasks.length} Remote Nodes</span>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {tasks.length > 0 ? tasks.map((task) => (
              <div key={task.id} className="task-item d-flex align-items-center p-3 border-bottom border-secondary border-opacity-10">
                <div className="me-3" onClick={() => toggleTask(task.id, task.completed)} style={{cursor: 'pointer'}}>
                  <i className={`bi ${task.completed ? 'bi-check-circle-fill text-success' : 'bi-circle text-secondary'}`}></i>
                </div>
                <div className="flex-grow-1" onClick={() => toggleTask(task.id, task.completed)} style={{cursor: 'pointer'}}>
                  <div className={`mb-0 ${task.completed ? 'task-completed' : ''}`}>
                    <span className="category-pill me-2">{task.category}</span>
                    {task.text}
                  </div>
                </div>
                <div className="text-secondary small me-3 d-none d-sm-block">{task.time}</div>
                <button className="btn btn-link text-danger p-0" onClick={() => deleteTask(task.id)}><i className="bi bi-trash3"></i></button>
              </div>
            )) : (
              <div className="p-5 text-center text-secondary">
                <i className="bi bi-cloud-check h1 opacity-25"></i>
                <p>{loading ? "Linking to database..." : "All systems clear. Cloud storage empty."}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 rounded bg-black bg-opacity-50 border border-secondary border-opacity-10">
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
            <span className="small fw-bold text-secondary opacity-75">REMOTE_LOG_STREAM</span>
          </div>
          {scanLogs.map((log, i) => (
            <div key={i} className="text-success" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;