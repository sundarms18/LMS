import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnrolledCourses } from '../../api/courseApi'; // Using the new API function

const MyCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const data = await getMyEnrolledCourses();
        setEnrolledCourses(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch your enrolled courses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 text-center text-xl font-semibold text-gray-700">Loading your courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <p className="text-red-500 text-xl mb-4">Error: {error}</p>
        <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 antialiased">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">My Enrolled Courses</h1>

      {enrolledCourses.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">You are not currently enrolled in any courses.</p>
          <Link
            to="/courses"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Browse Available Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
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
                  className="block w-full text-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Go to Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
