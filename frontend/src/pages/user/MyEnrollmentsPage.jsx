import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnrollmentStatuses } from '../../api/enrollmentApi';

const MyEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoading(true);
        const data = await getMyEnrollmentStatuses();
        setEnrollments(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch enrollment statuses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatuses();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 text-center text-xl font-semibold text-gray-700">Loading your enrollment history...</div>
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Enrollment Requests</h1>

      {enrollments.length === 0 ? (
        <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">You have not made any enrollment requests yet.</p>
            <Link
                to="/courses"
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
                Browse Courses to Enroll
            </Link>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{enrollment.courseId?.title || 'N/A'}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{enrollment.courseId?.description || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(enrollment.requestedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(enrollment.requestedAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(enrollment.status)}`}>
                      {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {enrollment.status === 'approved' ? (
                      <Link
                        to={`/courses/${enrollment.courseId?._id}`}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold"
                      >
                        View Course
                      </Link>
                    ) : enrollment.status === 'rejected' ? (
                        <span className="text-red-500">--</span>
                    ): (
                      <span className="text-gray-500">--</span>
                    )}
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

export default MyEnrollmentsPage;
