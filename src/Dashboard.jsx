// Inside the Dashboard component JSX
<nav className="top-nav">
  <div className="h4 m-0 fw-bold text-white">AXON <span className="text-primary">OS</span></div>
  <div className="d-flex gap-2">
    {/* NEW NAV LINK */}
    <button onClick={() => navigate('/library')} className="btn btn-sm btn-primary px-3">
      <i className="bi bi-book me-1"></i> LIBRARY
    </button>
    <button onClick={() => { setAuth(false); navigate('/login'); }} className="btn btn-sm btn-outline-danger">EXIT</button>
  </div>
</nav>