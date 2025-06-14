import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, deleteCourse } from '../../api/adminApi';

const AdminCourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCoursesData = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch courses.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesData();
  }, []);

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await deleteCourse(courseId);
        // Refresh course list
        setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
        // Or call fetchCoursesData(); for a full refresh
      } catch (err) {
        setError(err.message || 'Failed to delete course.');
        console.error(err);
        // Display error to user, perhaps using a toast notification system
        alert(`Error deleting course: ${err.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Courses</h1>
        <Link
          to="/admin/courses/new"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses found. Get started by creating a new one!</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                <th className="py-3 px-5 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  </td>
                  <td className="py-4 px-5">
                    <p className="text-sm text-gray-700 truncate" style={{ maxWidth: '300px' }}>
                      {course.description || 'No description provided.'}
                    </p>
                  </td>
                  <td className="py-4 px-5 text-center whitespace-nowrap space-x-2">
                    <button
                      onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                      className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCourseListPage;
