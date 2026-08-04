import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const PublicRoute = () => {
  const { loading } = useAuth();
  if (loading) return null;
  return <Outlet />;
};
export default PublicRoute;
