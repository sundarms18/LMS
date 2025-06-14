import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed Link and useAuth as they are handled in Navbar

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
// import CoursePage from './pages/CoursePage'; // Old - will be replaced
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

// User-facing course pages
import UserCourseListPage from './pages/user/UserCourseListPage';
import UserSingleCoursePage from './pages/user/UserSingleCoursePage';
import UserContentViewPage from './pages/user/UserContentViewPage';
import ManageCourseContentPage from './pages/admin/ManageCourseContentPage'; // Import ManageCourseContentPage
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage'; // Import AdminUserManagementPage
import AdminCourseListPage from './pages/admin/AdminCourseListPage'; // Import AdminCourseListPage
import AdminCreateCoursePage from './pages/admin/AdminCreateCoursePage'; // Import AdminCreateCoursePage
import AdminEditCoursePage from './pages/admin/AdminEditCoursePage'; // Import AdminEditCoursePage
import AdminManageContentPage from './pages/admin/AdminManageContentPage'; // Import AdminManageContentPage

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes for normal users (and admins) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboardPage />} />
            {/* User-facing course routes */}
            <Route path="/courses" element={<UserCourseListPage />} />
            <Route path="/courses/:courseId" element={<UserSingleCoursePage />} />
            <Route path="/courses/:courseId/content/:contentId" element={<UserContentViewPage />} />
            {/* Add other user-specific routes here if any */}
          </Route>

          {/* Protected Routes for admins only */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUserManagementPage />} />
            <Route path="/admin/courses" element={<AdminCourseListPage />} />
            <Route path="/admin/courses/new" element={<AdminCreateCoursePage />} />
            <Route path="/admin/courses/:courseId/edit" element={<AdminEditCoursePage />} />
            <Route path="/admin/courses/:courseId/manage" element={<ManageCourseContentPage />} /> {/* Existing route for course content (if any) or could be removed if modules replace this */}
            <Route path="/admin/modules/:moduleId/content" element={<AdminManageContentPage />} /> {/* New route for module content */}
            {/* Add other admin-specific routes here */}
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default App;
