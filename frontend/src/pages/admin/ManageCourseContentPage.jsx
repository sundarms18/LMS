import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ManageCourseContentPage = () => {
  const { courseId } = useParams();
  // In a real app, you'd fetch course details here to get its title, modules, etc.
  // For now, just displaying the ID.

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <nav className="mb-6">
        <Link
          to="/admin/dashboard"
          className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
        >
          &larr; Back to Admin Dashboard
        </Link>
      </nav>
      <div className="bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Content for Course
        </h1>
        <p className="text-lg text-indigo-600 font-semibold mb-6">
          Course ID: {courseId}
        </p>

        <div className="space-y-6">
          {/* Placeholder for Module Creation/Listing */}
          <div className="p-4 border border-dashed border-gray-300 rounded-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Modules</h2>
            <p className="text-gray-500">Module creation and management UI will go here.</p>
            {/* Example: Button to add new module */}
            <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Add New Module
            </button>
          </div>

          {/* Placeholder for Content Management (likely per module) */}
          <div className="p-4 border border-dashed border-gray-300 rounded-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Content Items</h2>
            <p className="text-gray-500">Content management UI (linked to selected module) will go here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCourseContentPage;
