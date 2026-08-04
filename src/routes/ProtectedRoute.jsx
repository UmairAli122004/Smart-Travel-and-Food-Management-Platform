import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};
export default ProtectedRoute;
