import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    // You might want to show a loading spinner here instead of redirecting prematurely
    return <div className="p-4 text-center">Authenticating...</div>;
  }

  if (!token || !user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Logged in but not an admin, trying to access admin-only route
    return <Navigate to="/dashboard" replace />; // Or a generic "Unauthorized" page
  }

  // If adminOnly is true, user must be admin (checked above).
  // If adminOnly is false, any logged-in user is fine.
  return <Outlet />; // Renders the nested route components (actual page)
};

export default ProtectedRoute;
