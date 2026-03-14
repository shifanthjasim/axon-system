import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const Library = () => {
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
    
    if (data) {
      setBooks([data[0], ...books]);
      setNewBook({ title: "", author: "", total_pages: "" });
    }
  };

  const updatePage = async (id, val) => {
    const page = parseInt(val) || 0;
    await supabase.from('books').update({ current_page: page }).eq('id', id);
    setBooks(books.map(b => b.id === id ? { ...b, current_page: page } : b));
  };

  const calculateProgress = (current, total) => {
    if (!total || total === 0) return 0;
    return Math.min(Math.round((current / total) * 100), 100);
  };

  return (
    <div className="dash-container">
      <style>{`
        .dash-container { min-height: 100vh; background: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; }
        
        /* Glassmorphism Panel */
        .glass-panel {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        /* Advanced Card Styling */
        .book-card-adv { 
          background: rgba(30, 41, 59, 0.3); 
          border: 1px solid rgba(255, 255, 255, 0.05); 
          border-radius: 20px; 
          padding: 24px; 
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .book-card-adv:hover {
          border-color: #3b82f6;
          transform: translateY(-5px);
          background: rgba(30, 41, 59, 0.5);
        }

        /* Cyber Progress Bar */
        .progress-bar-bg { 
          background: rgba(15, 23, 42, 0.8); 
          height: 6px; 
          border-radius: 10px; 
          margin: 20px 0; 
          border: 1px solid rgba(59, 130, 246, 0.1);
        }
        .progress-fill { 
          background: linear-gradient(90deg, #3b82f6, #60a5fa); 
          height: 100%; 
          border-radius: 10px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); 
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); 
        }

        /* Digital Inputs */
        .bookmark-input { 
          width: 65px; 
          background: #0f172a; 
          border: 1px solid #1e293b; 
          color: #3b82f6; 
          text-align: center; 
          border-radius: 8px; 
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          padding: 4px;
        }
        .bookmark-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
        }

        .lib-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
          gap: 20px; 
          padding: 20px 0; 
        }

        .cyber-btn-add {
          background: #3b82f6;
          border: none;
          color: white;
          font-weight: 700;
          letter-spacing: 1px;
          transition: 0.3s;
        }
        .cyber-btn-add:hover {
          background: #2563eb;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }

        @media (max-width: 576px) {
          .lib-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <div className="top-nav d-flex justify-content-between align-items-center p-3 px-4 border-bottom border-secondary border-opacity-10 bg-dark bg-opacity-50">
        <div className="h4 m-0 fw-bold text-white tracking-tight">
          AXON <span className="text-primary">LIBRARY_</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-sm btn-outline-primary px-3 rounded-pill fw-bold">
          <i className="bi bi-cpu-fill me-2"></i>DASHBOARD
        </button>
      </div>

      <div className="container mt-4">
        {/* Entry Panel */}
        <div className="glass-panel p-4 mb-5">
          <h6 className="text-primary fw-bold mb-3 small tracking-widest text-uppercase">
            <i className="bi bi-plus-circle-fill me-2"></i>Initialize_New_Entry
          </h6>
          <div className="row g-3">
            <div className="col-md-5">
              <input 
                className="form-control bg-dark bg-opacity-50 text-white border-secondary border-opacity-25 p-2 px-3 rounded-3" 
                placeholder="INTEL_TITLE" 
                value={newBook.title} 
                onChange={e => setNewBook({...newBook, title: e.target.value})} 
              />
            </div>
            <div className="col-md-4">
              <input 
                className="form-control bg-dark bg-opacity-50 text-white border-secondary border-opacity-25 p-2 px-3 rounded-3" 
                placeholder="AUTHOR_ID" 
                value={newBook.author} 
                onChange={e => setNewBook({...newBook, author: e.target.value})} 
              />
            </div>
            <div className="col-md-2">
              <input 
                type="number" 
                className="form-control bg-dark bg-opacity-50 text-white border-secondary border-opacity-25 p-2 px-3 rounded-3" 
                placeholder="MAX_PGS" 
                value={newBook.total_pages} 
                onChange={e => setNewBook({...newBook, total_pages: e.target.value})} 
              />
            </div>
            <div className="col-md-1">
              <button className="btn cyber-btn-add w-100 p-2 rounded-3" onClick={addBook}>
                ADD
              </button>
            </div>
          </div>
        </div>

        {/* Book Grid */}
        <div className="lib-grid">
          {books.map(book => {
            const progress = calculateProgress(book.current_page, book.total_pages);
            return (
              <div key={book.id} className="book-card-adv">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="overflow-hidden">
                    <h5 className="text-white fw-bold mb-1 text-truncate">{book.title}</h5>
                    <p className="text-primary opacity-75 small mb-0 fw-medium">BY: {book.author || "UNDEFINED"}</p>
                  </div>
                  <button 
                    className="btn btn-link text-danger p-0 border-0 opacity-50 hover-opacity-100"
                    onClick={async () => {
                      if(window.confirm("Purge this archive entry?")) {
                        await supabase.from('books').delete().eq('id', book.id);
                        setBooks(books.filter(b => b.id !== book.id));
                      }
                    }}
                  >
                    <i className="bi bi-trash3-fill fs-5"></i>
                  </button>
                </div>

                <div className="progress-bar-bg">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <span className="d-block small text-secondary text-uppercase fw-bold tracking-tighter" style={{fontSize: '10px'}}>Completion_Rate</span>
                    <span className="h5 fw-black text-white m-0">{progress}%</span>
                  </div>
                  <div className="text-end">
                    <span className="d-block small text-secondary text-uppercase fw-bold tracking-tighter mb-1" style={{fontSize: '10px'}}>Location_Pointer</span>
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <input 
                        type="number" 
                        className="bookmark-input" 
                        value={book.current_page} 
                        onChange={(e) => updatePage(book.id, e.target.value)}
                      />
                      <span className="text-secondary fw-bold">/ {book.total_pages || '???'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Library;