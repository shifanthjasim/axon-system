import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("axon_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Coding");
  const [liveTime, setLiveTime] = useState(new Date());
  
  // ⚡ AUTOMATED CODE SCANNER STATE
  const [scanLogs, setScanLogs] = useState(["[SYSTEM] KERNEL_BOOT_SUCCESS..."]);

  const categories = ['Gardening', 'Book Reading', 'Coding', 'GED'];
  const quotes = [
    "STAY DISCIPLINED. THE REWARD FOR WORK WELL DONE IS THE OPPORTUNITY TO DO MORE.",
    "WORK HARD IN SILENCE. LET SUCCESS BE YOUR NOISE.",
    "ATOMIC HABITS: 1% BETTER EVERY DAY LEADS TO EXPONENTIAL RESULTS.",
    "SUCCESS IS NOT FINAL, FAILURE IS NOT FATAL: IT IS THE COURAGE TO CONTINUE."
  ];

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    localStorage.setItem("axon_tasks", JSON.stringify(tasks));

    // Automated "Hacker" Scanner Loop - Complex Engineering Logs
    const scanInterval = setInterval(() => {
      const hex = Math.random().toString(16).toUpperCase().substring(2, 10);
      const cmds = [
        `PATCHING_CORE_BUFFER_AT_0x${hex}...`,
        `FETCHING_REMOTE_RESOURCES_FROM_SRI_LANKA_NODE_7...`,
        `ENCRYPTING_BIO_DATA_STREAM_SSL_V3...`,
        `OPTIMIZING_REACT_DOM_TREE_FLATTENING...`,
        `RE-ROUTING_ISP_TRAFFIC_VIA_TOR_TUNNEL...`,
        `DEBUGGING_MEMORY_LEAK_IN_MODULE_AXON_v1...`,
        `UPLOADING_LOCAL_STORAGE_SNAPSHOT_TO_CLOUD...`,
        `STABILIZING_VOLTAGE_FOR_MBP_2015_HARDWARE...`
      ];
      const newLog = `> [${new Date().toLocaleTimeString()}] ${cmds[Math.floor(Math.random()*cmds.length)]} [COMPLETE]`;
      
      setScanLogs(prev => [...prev.slice(-6), newLog]); 
    }, 1200);

    return () => {
      clearInterval(timer);
      clearInterval(scanInterval);
    };
  }, [tasks]);

  const addTask = () => {
    if (!input) return;
    const newTask = {
      id: Date.now(),
      text: input,
      category: category,
      completed: false,
      time: liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    setTasks([newTask, ...tasks]);
    setInput("");
  };

  return (
    <div className="min-vh-100 p-0 d-flex flex-column" style={{ 
      backgroundColor: '#3366ff', 
      color: '#ffff55', 
      fontFamily: '"Courier New", Courier, monospace',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .cursor { display: inline-block; width: 10px; height: 1.1rem; background: #ffff55; animation: blink 0.8s step-end infinite; }
        .dos-ui-border { border: 3px solid #ffffff; box-shadow: 8px 8px 0px #000; background: rgba(0, 50, 150, 0.95); position: relative; z-index: 5; }
        .scan-window { border: 2px solid #fff; background: #000; color: #00ff00; font-size: 0.75rem; padding: 12px; height: 160px; overflow: hidden; opacity: 0.9; }
        .marquee-container { background: #cccccc; color: #000; overflow: hidden; position: fixed; bottom: 0; width: 100%; padding: 4px 0; z-index: 100; border-top: 2px solid #000; }
        .marquee-content { display: flex; white-space: nowrap; animation: marqueeScroll 95s linear infinite; }
        input:focus { outline: none; }
        .btn-axon { border: 1px solid #ffff55; color: #ffff55; background: transparent; font-size: 0.75rem; margin: 2px; }
        .btn-axon.active { background: #ffff55 !important; color: #3366ff !important; font-weight: bold; }
      `}</style>

      {/* STATUS BAR */}
      <div className="bg-white text-dark px-2 d-flex justify-content-between small fw-bold shadow-sm" style={{zIndex: 10}}>
        <span>AXON_SYSTEM_v1.4.0</span>
        <span className="d-none d-md-inline">SENIOR SOFTWARE AND WEB ENGINEER: SHIFANTH M. JASIM</span>
        <span>{liveTime.toLocaleTimeString()}</span>
      </div>

      <div className="container py-3 flex-grow-1 d-flex flex-column align-items-center justify-content-start" style={{ maxWidth: '850px', zIndex: 6 }}>
        
        {/* MAIN PANEL */}
        <div className="dos-ui-border p-3 p-md-4 w-100 mb-3 mt-md-2">
          <header className="text-center mb-3">
            <h4 className="fw-bold mb-0">OPERATIONS_LOG_MANAGER</h4>
            <div className="small opacity-75">SYNDICATE_LABS // KANDY_CENTRAL_UPLINK</div>
          </header>

          <div className="mb-4 p-3 border border-white bg-black bg-opacity-30">
            <div className="d-flex align-items-center mb-3">
              <span className="fw-bold me-2">INIT_TASK{'>'}</span>
              <input 
                type="text" 
                className="bg-transparent border-0 text-white w-100 fw-bold shadow-none" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="..."
              />
              <span className="cursor"></span>
            </div>
            
            <div className="d-flex gap-1 flex-wrap justify-content-center">
              {categories.map((cat, idx) => (
                <button 
                  key={cat} onClick={() => setCategory(cat)} 
                  className={`btn btn-axon ${category === cat ? 'active' : ''}`}
                >
                  F{idx + 1}-{cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-white bg-black bg-opacity-40 overflow-hidden">
            <div className="d-flex bg-white text-dark fw-bold px-2 py-1" style={{ fontSize: '0.7rem' }}>
              <div style={{ width: '10%' }}>ID</div>
              <div style={{ width: '75%' }}>OBJECTIVE_DATA</div>
              <div style={{ width: '15%' }} className="text-end">RMV</div>
            </div>
            <div style={{ maxHeight: '22vh', overflowY: 'auto' }}>
              {tasks.map((task, index) => (
                <div key={task.id} className="d-flex px-2 py-2 border-bottom border-white align-items-center" style={{ fontSize: '0.85rem' }}>
                  <div style={{ width: '10%' }} className="opacity-50">{index + 1}</div>
                  <div style={{ width: '75%' }} className={task.completed ? 'text-decoration-line-through opacity-25' : ''} onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))} style={{cursor:'pointer'}}>
                    [{task.category.substring(0,4)}] {task.text}
                  </div>
                  <div style={{ width: '15%' }} className="text-end">
                    <span onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="text-danger fw-bold" style={{cursor: 'pointer'}}>[X]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🤖 AUTOMATED SYSTEM ANALYZER */}
        <div className="w-100 px-2" style={{marginBottom: '60px'}}>
          <div className="bg-dark text-white px-2 small border border-bottom-0 border-white d-inline-block">SYS_ANALYZER_v4.2</div>
          <div className="scan-window shadow-lg">
            {scanLogs.map((log, i) => (
              <div key={i} className="mb-1">{log}</div>
            ))}
            <div className="cursor"></div>
          </div>
        </div>
      </div>

      {/* 🚀 TICKER */}
      <div className="marquee-container">
        <div className="marquee-content">
           {[...quotes, ...quotes].map((q, i) => (
             <span key={i} className="px-5">*** {q} ***</span>
           ))}
        </div>
      </div>
    </div>
  );
}

export default App;