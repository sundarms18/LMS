import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const CourseListAdmin = ({ refreshTrigger }) => { // Added refreshTrigger
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/admin/courses');
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [fetchCourses, token, refreshTrigger]); // Listen to refreshTrigger

  if (loading) return <p className="text-center p-4">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500 p-4">Error: {error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Course List</h2>
      {courses.length === 0 ? <p>No courses found. Create one below!</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modules</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map(course => (
                <tr key={course._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.modules?.length || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                    <Link
                        to={`/admin/courses/${course._id}/manage`}
                        className="text-green-600 hover:text-green-900"
                    >
                        Manage Content
                    </Link>
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

export default CourseListAdmin;
