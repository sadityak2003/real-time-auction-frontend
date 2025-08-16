import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import './styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          Star Pawns
        </Link>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          
          {user ? (
            <>
              <Link to="/create-auction" className="btn btn-primary">
                Create Auction
              </Link>
              <span className="nav-text">Hi, {user.username}</span>
              <button onClick={handleLogout} className="nav-button logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className="nav-button login">
                Login
              </button>
              <button onClick={() => setShowRegister(true)} className="btn btn-primary">
                Register
              </button>
            </>
          )}
        </nav>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} />}
    </header>
  );
};

export default Header;
