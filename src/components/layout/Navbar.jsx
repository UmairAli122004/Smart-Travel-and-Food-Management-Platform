import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, logout } from '../../services/authService';
import '../../styles/navbar.css';
const Navbar = () => {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const loggedIn = isAuthenticated();
  const user = getCurrentUser();
  const handleLogout = () => {
    logout();
    setIsNavOpen(false);
    navigate('/', { replace: true });
  };
  const closeNav = () => setIsNavOpen(false);
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold text-white" to={loggedIn ? '/dashboard' : '/'} onClick={closeNav}>
          Smart Travel and Food Management Platform
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="appNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            {loggedIn ? (
              <>
                <li className="nav-item me-3 text-light small">
                  <span className="badge bg-secondary me-2">{user?.role}</span>
                  {user?.email}
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <NavLink
                    className="btn btn-outline-light"
                    to="/register"
                    onClick={closeNav}
                  >
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="btn btn-primary"
                    to="/login"
                    onClick={closeNav}
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
