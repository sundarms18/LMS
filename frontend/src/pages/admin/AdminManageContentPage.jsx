import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import AdminContentForm from '../../components/admin/forms/AdminContentForm';
import {
  createContent,
  updateContent,
  deleteContent,
  getCourseDetails // To refresh module data
} from '../../api/adminApi';

const AdminManageContentPage = () => {
  const { moduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize moduleData and courseIdFromState from location.state
  // The !! ensures that if location.state is null/undefined, we don't try to destructure it.
  const { module: initialModuleData, courseId: courseIdFromState } = location.state || {};

  const [moduleData, setModuleData] = useState(initialModuleData);
  const [courseId, setCourseId] = useState(courseIdFromState);
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null); // null for new, object for edit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // For form submission errors
  const [pageError, setPageError] = useState(null); // For page level errors (e.g., initial data missing)

  useEffect(() => {
    if (!initialModuleData || !courseIdFromState) {
      setPageError('Module data or Course ID not provided. Please navigate from the course edit page.');
      // Optionally, redirect or offer a link to go back
    }
  }, [initialModuleData, courseIdFromState]);

  const refreshModuleData = async () => {
    if (!courseId) {
      setError('Course ID is missing, cannot refresh module data.');
      return;
    }
    try {
      const fullCourseData = await getCourseDetails(courseId);
      const updatedModule = fullCourseData.modules.find(m => m._id === moduleId);
      if (updatedModule) {
        setModuleData(updatedModule);
      } else {
        // Module might have been deleted, or course structure changed.
        setPageError('Module not found in course details after refresh. It might have been deleted.');
        setModuleData(null); // Clear module data
        // Consider navigating away or showing a more permanent error.
      }
    } catch (err) {
      setError(`Failed to refresh module data: ${err.message || 'Unknown error'}`);
    }
  };


  const handleOpenContentForm = (contentItem = null) => {
    setEditingContent(contentItem);
    setShowContentForm(true);
    setError(null); // Clear previous form errors
  };

  const handleCloseContentForm = () => {
    setShowContentForm(false);
    setEditingContent(null);
    setError(null);
  };

  const handleContentFormSubmit = async (contentFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingContent && editingContent._id) {
        await updateContent(editingContent._id, contentFormData);
      } else {
        await createContent(moduleId, contentFormData);
      }
      await refreshModuleData();
      handleCloseContentForm();
    } catch (err) {
      setError(err.message || 'Failed to save content.');
      console.error('Content submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content item?')) {
      try {
        await deleteContent(contentId);
        await refreshModuleData();
      } catch (err) {
        setError(err.message || 'Failed to delete content.'); // Show error, maybe as toast
        alert(`Error deleting content: ${err.message || 'Unknown error'}`);
      }
    }
  };

  if (pageError) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-red-500 text-xl mb-4">{pageError}</p>
        <Link to="/admin/courses" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go to Courses
        </Link>
      </div>
    );
  }

  if (!moduleData) {
    return <div className="text-center p-6">Loading module details or module not found...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-xl rounded-lg p-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Content for: <span className="text-indigo-700">{moduleData.title}</span>
          </h1>
          <Link
            to={`/admin/courses/${courseId}/edit`}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
          >
            Back to Course Edit
          </Link>
        </div>
        <p className="text-sm text-gray-500 mb-6">Module ID: {moduleId}</p>

        <div className="mb-8">
          <button
            onClick={() => handleOpenContentForm()}
            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Add New Content
          </button>
        </div>

        {moduleData.content && moduleData.content.length > 0 ? (
          <ul className="space-y-4">
            {moduleData.content.map((item) => (
              <li key={item._id} className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      item.type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type}
                    </span>
                    {item.type === 'video' && item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline ml-2 block truncate w-64 sm:w-auto" title={item.url}>
                            {item.url}
                        </a>
                    )}
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleOpenContentForm(item)}
                      className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteContent(item._id)}
                      className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                 {item.type === 'text' && item.text_content && (
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap bg-white p-2 border rounded">
                        {item.text_content.substring(0,150)}{item.text_content.length > 150 ? '...' : ''}
                    </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8">No content items in this module yet. Add some!</p>
        )}
      </div>

      {showContentForm && (
        <AdminContentForm
          initialData={editingContent}
          onSubmit={handleContentFormSubmit}
          onCancel={handleCloseContentForm}
          isSubmitting={isSubmitting}
        />
      )}
      {error && ( // Display form-specific errors
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button onClick={() => setError(null)} className="ml-2 text-red-700 font-bold">X</button>
          </div>
        )}
    </div>
  );
};

export default AdminManageContentPage;
