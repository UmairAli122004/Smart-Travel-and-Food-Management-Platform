import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/authService';
const DashboardPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };
  return (
    <div className="container py-5">
      <div className="card shadow-sm border p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div>
            <h1 className="h4 fw-bold text-dark mb-1">
              Smart Travel & Food Platform Dashboard
            </h1>
            <p className="text-muted small mb-0">
              Welcome back to your account portal
            </p>
          </div>
          <button className="btn btn-outline-danger btn-sm px-3" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="p-3 bg-light border rounded">
              <span className="text-muted small d-block">Logged Email</span>
              <strong className="text-dark">{user?.email || 'N/A'}</strong>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 bg-light border rounded">
              <span className="text-muted small d-block">Account Role</span>
              <span className="badge bg-primary text-uppercase px-2 py-1 mt-1">
                {user?.role || 'N/A'}
              </span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 bg-light border rounded">
              <span className="text-muted small d-block">User ID</span>
              <strong className="text-dark">{user?.userId || 'N/A'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
