import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, logout } from '../../services/authService';
import '../../styles/navbar.css';
const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const user = getCurrentUser();
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold text-white" to={loggedIn ? '/dashboard' : '/'}>
          Smart Travel and Food Management Platform
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#appNavbar"
          aria-controls="appNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="appNavbar">
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
                  >
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="btn btn-primary"
                    to="/login"
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
