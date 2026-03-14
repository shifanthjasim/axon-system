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
        .lib-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 20px; }
        .book-card-adv { background: rgba(30, 41, 59, 0.5); border: 1px solid #3b82f6; border-radius: 20px; padding: 20px; position: relative; }
        .progress-bar-bg { background: #0f172a; height: 8px; border-radius: 10px; margin: 15px 0; overflow: hidden; }
        .progress-fill { background: #3b82f6; height: 100%; transition: 0.5s; box-shadow: 0 0 10px #3b82f6; }
        .bookmark-input { width: 60px; background: #000; border: 1px solid #3b82f6; color: #3b82f6; text-align: center; border-radius: 4px; font-weight: bold; }
      `}</style>

      <div className="top-nav d-flex justify-content-between align-items-center">
        <div className="h4 m-0 fw-bold text-white">AXON <span className="text-primary">LIBRARY</span></div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-sm btn-outline-primary fw-bold">DASHBOARD</button>
      </div>

      <div className="container mt-4">
        <div className="panel mb-4 p-4" style={{background: 'rgba(30, 41, 59, 0.4)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
          <h5 className="text-white mb-3">Initialize New Archive</h5>
          <div className="row g-2">
            <div className="col-md-5"><input className="form-control bg-dark text-white border-0" placeholder="Book Title" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} /></div>
            <div className="col-md-4"><input className="form-control bg-dark text-white border-0" placeholder="Author" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} /></div>
            <div className="col-md-2"><input type="number" className="form-control bg-dark text-white border-0" placeholder="Total Pgs" value={newBook.total_pages} onChange={e => setNewBook({...newBook, total_pages: e.target.value})} /></div>
            <div className="col-md-1"><button className="btn btn-primary w-100 fw-bold" onClick={addBook}>ADD</button></div>
          </div>
        </div>

        <div className="lib-grid">
          {books.map(book => {
            const progress = calculateProgress(book.current_page, book.total_pages);
            return (
              <div key={book.id} className="book-card-adv">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="text-white mb-0">{book.title}</h5>
                    <p className="text-secondary small">{book.author}</p>
                  </div>
                  <i className="bi bi-trash text-danger pointer" onClick={async () => {
                    await supabase.from('books').delete().eq('id', book.id);
                    setBooks(books.filter(b => b.id !== book.id));
                  }}></i>
                </div>

                <div className="progress-bar-bg">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="small text-primary fw-bold">{progress}% COMPLETE</div>
                  <div className="d-flex align-items-center gap-2">
                    <input 
                      type="number" 
                      className="bookmark-input" 
                      value={book.current_page} 
                      onChange={(e) => updatePage(book.id, e.target.value)}
                    />
                    <span className="text-secondary small">/ {book.total_pages || '?'}</span>
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