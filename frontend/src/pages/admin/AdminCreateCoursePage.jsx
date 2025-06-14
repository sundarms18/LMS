import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminCourseForm from '../../components/admin/forms/AdminCourseForm';
import { createCourse } from '../../api/adminApi';

const AdminCreateCoursePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (courseData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createCourse(courseData);
      navigate('/admin/courses'); // Redirect to course list on success
    } catch (err) {
      setError(err.message || 'Failed to create course. Please try again.');
      console.error('Failed to create course:', err);
      setIsSubmitting(false); // Keep form active if error
    }
    // No need to set isSubmitting to false on success because we navigate away
  };

  const handleCancel = () => {
    navigate('/admin/courses');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create New Course</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <AdminCourseForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AdminCreateCoursePage;
