import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import useAuth

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import CoursePage from './pages/CoursePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import ManageCourseContentPage from './pages/admin/ManageCourseContentPage'; // Import ManageCourseContentPage

function App() {
  const { user, logout, loading } = useAuth();

  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4 items-center">
          <li><Link to="/">Home</Link></li>
          {loading ? (
            <li>Loading...</li>
          ) : user ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              {user.role === 'admin' && (
                <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
              )}
              <li>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Logout
                </button>
              </li>
              <li className="ml-auto text-sm">Welcome, {user.name}! ({user.role})</li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
      <main className="p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes for normal users (and admins) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/courses/:courseId" element={<CoursePage />} />
            {/* Add other user-specific routes here if any */}
          </Route>

          {/* Protected Routes for admins only */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/courses/:courseId/manage" element={<ManageCourseContentPage />} />
            {/* Add other admin-specific routes here */}
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
export default App;
