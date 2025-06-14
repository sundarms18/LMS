import React, { useState } from 'react';
import UserManagement from '../components/admin/UserManagement';
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

      <section id="user-management">
        <UserManagement />
      </section>

      <section id="course-management">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Course Management</h2>
          <button
            onClick={() => setShowCourseForm(prev => !prev)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {showCourseForm ? 'Cancel' : 'Create New Course'}
          </button>
        </div>

        {showCourseForm && (
          <CourseForm
            onSubmitFunction={handleCourseCreate}
            onCancel={() => {
              setShowCourseForm(false);
              setCourseFormError(''); // Clear errors when cancelling
            }}
          />
        )}
        {courseFormError && !showCourseForm && ( // Show error if form submitted and then hidden due to error
             <p className="text-red-500 text-center mb-4 p-4 bg-red-100 rounded-md">{courseFormError}</p>
        )}

        <CourseListAdmin refreshTrigger={refreshKey} />
      </section>
    </div>
  );
};

export default AdminDashboardPage;
