
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/useAuth';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { accessToken, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((previous) => !previous);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-mark">J</span>
          <span>Job<span className="navbar-logo-accent">Board</span></span>
        </Link>

        <ul className={isMenuOpen ? 'navbar-links active' : 'navbar-links'}>
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>

          <li>
            <Link to="/jobs" onClick={closeMenu}>Explore Jobs</Link>
          </li>

          {accessToken && user?.role === 'job_seeker' && (
            <li>
              <Link to="/my-applications" onClick={closeMenu}>
                My Applications
              </Link>
            </li>
          )}

          {accessToken &&
            (user?.role === 'recruiter' || user?.is_superuser) && (
              <li>
                <Link to="/admin" onClick={closeMenu}>Dashboard</Link>
              </li>
            )}
        </ul>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title="Toggle color theme"
            type="button"
          >
            {theme === 'light' ? '☾' : '☀'}
          </button>

          {!accessToken ? (
            <Link to="/login" className="navbar-login" onClick={closeMenu}>
              Sign in <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <button
              className="navbar-logout"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          )}

          <button
            className={`navbar-toggle ${isMenuOpen ? 'is-open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <span id="primary-navigation" className="navbar-navigation-anchor" />
      </div>
    </nav>
  );
}

export default Navbar;
