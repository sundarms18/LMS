import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link
import AdminCourseForm from '../../components/admin/forms/AdminCourseForm';
import AdminModuleForm from '../../components/admin/forms/AdminModuleForm'; // Added AdminModuleForm
import {
  getCourseDetails,
  updateCourse,
  createModule, // Added module APIs
  updateModule,
  deleteModule
} from '../../api/adminApi';

const AdminEditCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null); // Will store { ...courseDetails, modules: [] }
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // For course form
  const [isModuleSubmitting, setIsModuleSubmitting] = useState(false); // For module form
  const [error, setError] = useState(null); // For course form
  const [moduleError, setModuleError] = useState(null); // For module form
  const [fetchError, setFetchError] = useState(null);

  // Module form state
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null); // null for new, object for edit

  const fetchCourseDetailsAndModules = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getCourseDetails(courseId);
      setCourseData(data); // Assuming data includes course details and modules array
    } catch (err) {
      setFetchError(err.message || `Failed to fetch course details for ID ${courseId}.`);
      console.error('Failed to fetch course:', err);
      setCourseData(null); // Clear course data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetailsAndModules();
  }, [courseId]);

  const handleCourseSubmit = async (updatedCourseData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Ensure we only send relevant fields for course update, not modules array
      const { title, description } = updatedCourseData;
      await updateCourse(courseId, { title, description });
      // Optionally re-fetch or just update local state if backend returns updated course
      setCourseData(prev => ({ ...prev, ...updatedCourseData }));
      alert('Course details updated successfully!');
      // No navigation, user stays on page to manage modules
    } catch (err) {
      setError(err.message || 'Failed to update course. Please try again.');
      console.error('Failed to update course:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCourseEditCancel = () => {
    // If you want a "Back to Course List" button for the main course form
    navigate('/admin/courses');
  };

  // --- Module Action Handlers ---
  const handleOpenModuleForm = (moduleItem = null) => {
    setEditingModule(moduleItem);
    setShowModuleForm(true);
    setModuleError(null);
  };

  const handleCloseModuleForm = () => {
    setShowModuleForm(false);
    setEditingModule(null);
    setModuleError(null);
  };

  const handleModuleFormSubmit = async (moduleFormData) => {
    setIsModuleSubmitting(true);
    setModuleError(null);
    try {
      if (editingModule && editingModule._id) { // Editing existing module
        await updateModule(editingModule._id, moduleFormData);
      } else { // Creating new module
        await createModule(courseId, moduleFormData);
      }
      await fetchCourseDetailsAndModules(); // Re-fetch to get updated module list
      handleCloseModuleForm();
    } catch (err) {
      setModuleError(err.message || 'Failed to save module.');
      console.error('Module submission error:', err);
    } finally {
      setIsModuleSubmitting(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      try {
        await deleteModule(moduleId);
        await fetchCourseDetailsAndModules(); // Re-fetch
      } catch (err) {
        alert(`Error deleting module: ${err.message || 'Unknown error'}`);
        console.error('Delete module error:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading course details...</div>;
  }

  if (fetchError || !courseData) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500 mb-4">{fetchError || 'Course not found.'}</p>
        <button
          onClick={() => navigate('/admin/courses')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Course List
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Course Details Form Section */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Edit Course Details</h1>
            <button
                onClick={handleCourseEditCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
                Back to Course List
            </button>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong> <span className="block sm:inline">{error}</span>
          </div>
        )}
        <AdminCourseForm
          initialData={{ title: courseData.title, description: courseData.description }}
          onSubmit={handleCourseSubmit}
          isSubmitting={isSubmitting}
          onCancel={null} // Main form cancel is handled by "Back to Course List"
        />
      </div>

      {/* Modules Management Section */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Modules</h2>
          <button
            onClick={() => handleOpenModuleForm()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add New Module
          </button>
        </div>

        {courseData.modules && courseData.modules.length > 0 ? (
          <ul className="space-y-4">
            {courseData.modules.map((module) => (
              <li key={module._id} className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{module.description || 'No description.'}</p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 mt-1 sm:mt-0">
                    <button
                      onClick={() => handleOpenModuleForm(module)}
                      className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                      Edit
                    </button>
                    <Link
                      to={`/admin/modules/${module._id}/content`}
                      state={{ module: module, courseId: courseData._id }} // Pass module data and courseId
                      className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Manage Content
                    </Link>
                    <button
                      onClick={() => handleDeleteModule(module._id)}
                      className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No modules yet. Add one to get started!</p>
        )}
      </div>

      {/* Module Form Modal */}
      {showModuleForm && (
        <AdminModuleForm
          initialData={editingModule}
          onSubmit={handleModuleFormSubmit}
          onCancel={handleCloseModuleForm}
          isSubmitting={isModuleSubmitting}
        />
      )}
      {moduleError && ( // Display module-specific errors, perhaps near the form or as a toast
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
            <strong className="font-bold">Module Error: </strong>
            <span className="block sm:inline">{moduleError}</span>
          </div>
        )}
    </div>
  );
};

export default AdminEditCoursePage;
