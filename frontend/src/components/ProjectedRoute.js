import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div style={{padding:40,textAlign:'center'}}>Loading…</div>;
  if (!isAuthenticated) return null;            // will be handled in App.js
  return children;
};

export default ProtectedRoute;
