import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth(); // Use isAuthenticated and authLoading

  if (authLoading) {
    // Show a loading spinner or a blank screen while checking authentication state
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-4 text-center text-lg">Authenticating...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // At this point, user is authenticated. Now check for admin role if required.
  // The user object should be available if isAuthenticated is true.
  if (adminOnly && (!user || user.role !== 'admin')) {
    // Logged in but not an admin, trying to access admin-only route
    return <Navigate to="/dashboard" replace />; // Or a generic "Unauthorized" page
  }

  // If adminOnly is true, user must be admin (checked above).
  // If adminOnly is false, any logged-in user is fine.
  return <Outlet />; // Renders the nested route components (actual page)
};

export default ProtectedRoute;
