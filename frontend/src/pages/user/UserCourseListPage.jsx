import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedCourses } from '../../api/courseApi';
import { requestEnrollment, getMyEnrollmentStatuses } from '../../api/enrollmentApi'; // Import enrollment APIs
import { useAuth } from '../../context/AuthContext'; // To check if user is authenticated

const UserCourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [enrollmentsMap, setEnrollmentsMap] = useState({}); // Stores enrollment status by courseId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestingEnrollmentId, setRequestingEnrollmentId] = useState(null); // Track which course enrollment is being requested
  const [notification, setNotification] = useState({ message: '', type: '' }); // For success/error messages

  const { isAuthenticated } = useAuth(); // Check if user is logged in

  const fetchPageData = async () => {
    setLoading(true);
    setError(null);
    try {
      const coursesData = await getPublishedCourses();
      setCourses(coursesData);

      if (isAuthenticated) { // Only fetch enrollments if user is logged in
        const enrollmentData = await getMyEnrollmentStatuses();
        const newEnrollmentsMap = {};
        enrollmentData.forEach(enrollment => {
          newEnrollmentsMap[enrollment.courseId._id] = enrollment.status;
        });
        setEnrollmentsMap(newEnrollmentsMap);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch page data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [isAuthenticated]); // Re-fetch if auth state changes

  const handleEnrollRequest = async (courseId) => {
    if (!isAuthenticated) {
      setNotification({ message: 'Please log in to enroll.', type: 'error' });
      // Consider redirecting to login page: navigate('/login');
      return;
    }
    setRequestingEnrollmentId(courseId);
    setNotification({ message: '', type: '' });
    try {
      await requestEnrollment(courseId);
      setNotification({ message: 'Enrollment requested successfully! You will be notified upon approval.', type: 'success' });
      // Update enrollmentsMap locally or re-fetch
      setEnrollmentsMap(prev => ({ ...prev, [courseId]: 'pending' }));
    } catch (err) {
      setNotification({ message: err.message || 'Failed to request enrollment.', type: 'error' });
      console.error('Enrollment request error:', err);
    } finally {
      setRequestingEnrollmentId(null);
    }
  };

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

  const getEnrollmentButton = (course) => {
    const status = enrollmentsMap[course._id];
    const isRequesting = requestingEnrollmentId === course._id;

    if (!isAuthenticated) {
         return (
            <button
                onClick={() => handleEnrollRequest(course._id)} // Will show login prompt
                className="w-full px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors duration-200"
            >
                Enroll
            </button>
        );
    }

    switch (status) {
      case 'approved':
        return (
          <Link
            to={`/courses/${course._id}`}
            className="block w-full text-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            View Course (Enrolled)
          </Link>
        );
      case 'pending':
        return (
          <button
            disabled
            className="w-full px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg cursor-not-allowed"
          >
            Pending Approval
          </button>
        );
      case 'rejected':
        return (
          <button
            disabled
            className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg cursor-not-allowed"
          >
            Enrollment Rejected
          </button>
        );
      default: // Not enrolled or no status
        return (
          <button
            onClick={() => handleEnrollRequest(course._id)}
            disabled={isRequesting}
            className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition-colors duration-200 ${
              isRequesting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isRequesting ? 'Requesting...' : 'Enroll'}
          </button>
        );
    }
  };


  return (
    <div className="container mx-auto p-6 antialiased">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Explore Our Courses</h1>

      {notification.message && (
        <div className={`mb-6 p-4 rounded-md text-center text-sm ${
          notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {notification.message}
        </div>
      )}

      {courses.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No courses available at the moment. Please check back later!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course._id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 ease-in-out">
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
                  Modules: <span className="font-medium text-gray-700">{course.moduleCount || 0}</span>
                </div>
              </div>
              <div className="p-6 pt-0">
                {getEnrollmentButton(course)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCourseListPage;
