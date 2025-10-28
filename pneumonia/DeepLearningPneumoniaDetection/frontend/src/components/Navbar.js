import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🫁</span>
          Pneumonia Detection
        </Link>
        <div className="nav-right">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link 
                to="/" 
                className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/detection" 
                className={location.pathname === '/detection' ? 'nav-link active' : 'nav-link'}
              >
                Pneumonia Detection
              </Link>
            </li>
          </ul>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
