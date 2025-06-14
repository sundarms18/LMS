import React, { useState, useEffect } from 'react';

const CourseForm = ({ onSubmitFunction, initialData = null, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(''); // For form-specific errors

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    try {
      await onSubmitFunction({ title, description });
      // Parent component should handle success (e.g., hide form, refresh list)
      // Reset form fields for next use if it's a create form
      if (!initialData) {
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      // Error is typically handled by the onSubmitFunction's catch block
      // but can set a local error if needed.
      setError(err.message || 'An error occurred.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        {initialData ? 'Edit Course' : 'Create New Course'}
      </h3>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="courseTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="courseDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-3">
          {onCancel && (
             <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {initialData ? 'Save Changes' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
