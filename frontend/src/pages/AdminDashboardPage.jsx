import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import CourseListAdmin from '../components/admin/CourseListAdmin';
import CourseForm from '../components/admin/CourseForm';
import apiClient from '../api/axios';

const AdminDashboardPage = () => {
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseFormError, setCourseFormError] = useState('');
  // refreshKey will be incremented to trigger a refresh of the CourseListAdmin
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCourseCreate = async (courseData) => {
    setCourseFormError('');
    try {
      await apiClient.post('/admin/courses', courseData);
      setShowCourseForm(false); // Hide form on success
      setRefreshKey(prevKey => prevKey + 1); // Trigger list refresh
    } catch (err) {
      console.error('Error creating course:', err);
      setCourseFormError(err.response?.data?.message || 'Failed to create course.');
      // Keep form visible to show error
      throw err; // Re-throw to be caught by CourseForm if it handles its own errors
    }
  };

  return (
    <div className="p-4 space-y-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </header>

      <section id="user-management" className="mb-8 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">User Administration</h2>
        <p className="text-gray-600 mb-4">
          Manage user accounts, approve new registrations, and view user details.
        </p>
        <Link
          to="/admin/users"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to User Management
        </Link>
      </section>

      <section id="course-management" className="mb-8 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Course Administration</h2>
        <p className="text-gray-600 mb-4">
          Create, edit, and manage course details and their content structure.
        </p>
        <Link
          to="/admin/courses"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Go to Course Management
        </Link>
      </section>

      <section id="enrollment-management" className="mb-8 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Enrollment Management</h2>
        <p className="text-gray-600 mb-4">
          Review pending enrollment requests, and manage course enrollments.
        </p>
        <Link
          to="/admin/enrollments"
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Manage Enrollments
        </Link>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
