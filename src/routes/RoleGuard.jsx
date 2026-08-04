import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const RoleGuard = ({ allowedRoles }) => {
  const { role, loading } = useAuth();
  if (loading) return null;

  // Normalize role to handle Spring Security's ROLE_ prefix
  const normalizedRole = role?.startsWith('ROLE_') ? role.substring(5) : role;

  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};
export default RoleGuard;
