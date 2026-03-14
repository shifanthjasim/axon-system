import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Default credentials check
    if (username === 'user' && password === 'user') {
      setAuth(true);
      navigate('/dashboard');
    } else {
      // Trigger error and animation
      setIsShaking(true);
      setError(username !== 'user' ? 'Invalid Username' : 'Incorrect Password');
      setTimeout(() => setIsShaking(false), 500); // Reset shake
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#0f172a' }}>
      <style>{`
        .apple-login-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .login-input {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          border-radius: 12px;
          padding: 12px 20px;
          margin-bottom: 15px;
        }
        .login-input:focus {
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 0 2px #6366f1;
          color: white;
        }
        .login-btn {
          background: #6366f1;
          border: none;
          border-radius: 12px;
          padding: 12px;
          font-weight: 600;
          width: 100%;
          margin-top: 10px;
        }
      `}</style>

      <div className={`apple-login-card shadow-2xl ${isShaking ? 'shake' : ''}`}>
        <div className="mb-4">
            <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: '3rem' }}></i>
        </div>
        <h2 className="fw-bold text-white mb-2">AXON OS</h2>
        <p className="text-secondary small mb-4">Please sign in to proceed</p>

        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Username" 
            className="form-control login-input" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="form-control login-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <div className="text-danger small mb-3">{error}</div>}
          
          <button type="submit" className="btn btn-primary login-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;