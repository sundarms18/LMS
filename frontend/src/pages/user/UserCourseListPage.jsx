import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedCourses } from '../../api/courseApi';

const UserCourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getPublishedCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch courses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 text-center text-xl font-semibold text-gray-700">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <p className="text-red-500 text-xl mb-4">Error: {error}</p>
        <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 antialiased">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Explore Our Courses</h1>

      {courses.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No courses available at the moment. Please check back later!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course._id} className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 truncate" title={course.title}>
                  {course.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">
                  {course.description || 'No description available.'}
                </p>
                <div className="text-sm text-gray-500 mb-1">
                  Instructor: <span className="font-medium text-gray-700">{course.instructor?.name || 'N/A'}</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Modules: <span className="font-medium text-gray-700">{course.modules?.length || 0}</span>
                </div>
                <Link
                  to={`/courses/${course._id}`}
                  className="block w-full text-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCourseListPage;
