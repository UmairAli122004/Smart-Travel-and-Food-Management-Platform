import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      const phone = localStorage.getItem('phone');
      if (token && token !== 'null' && role && role !== 'null' && userId && userId !== 'null') {
        setUser({ token, email, role, userId, username, phone });
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);
  const login = useCallback((authData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('email', authData.email);
    localStorage.setItem('role', authData.role);
    localStorage.setItem('userId', authData.userId);
    localStorage.setItem('username', authData.username || '');
    if (authData.phone) {
      localStorage.setItem('phone', authData.phone);
    }
    setUser(authData);

    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectUrl, { replace: true });
      return;
    }

    switch (authData.role) {
      case 'ADMIN':
        navigate('/admin/dashboard', { replace: true });
        break;
      case 'VENDOR':
        navigate('/vendor/restaurants', { replace: true });
        break;
      case 'PASSENGER':
      case 'ROLE_PASSENGER':
        const pendingOrder = sessionStorage.getItem('pendingOrder');
        if (authData.profileComplete === true || authData.profileComplete === 'true') {
          if (pendingOrder) {
            navigate('/passenger/place-order', { replace: true });
          } else {
            navigate('/passenger/dashboard', { replace: true });
          }
        } else {
          navigate('/passenger/profile-setup', { replace: true });
        }
        break;
      default:
        navigate('/unauthorized', { replace: true });
    }
  }, [navigate]);
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('phone');

    // Navigate first to trigger unmounts
    navigate('/', { replace: true });

    // Cleanup any lingering MUI body locks AFTER components unmount
    setTimeout(() => {
      setUser(null);
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 150);
  }, [navigate]);
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    role: user?.role,
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
