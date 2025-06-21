import React, { useState, useEffect, useCallback } from 'react';
import {
  getPendingEnrollments,
  getAllEnrollments,
  approveEnrollment,
  rejectEnrollment
} from '../../api/adminEnrollmentApi';

const AdminEnrollmentManagementPage = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'all'
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [allEnrollmentsData, setAllEnrollmentsData] = useState([]);

  const [loadingPending, setLoadingPending] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [errorPending, setErrorPending] = useState(null);
  const [errorAll, setErrorAll] = useState(null);

  const [actionError, setActionError] = useState(null); // For errors during approve/reject
  const [actionLoadingId, setActionLoadingId] = useState(null); // To show loading on specific row button

  const fetchPending = useCallback(async () => {
    setLoadingPending(true);
    setErrorPending(null);
    setActionError(null);
    try {
      const data = await getPendingEnrollments();
      setPendingEnrollments(data);
    } catch (err) {
      setErrorPending(err.message || 'Failed to load pending enrollments.');
    } finally {
      setLoadingPending(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoadingAll(true);
    setErrorAll(null);
    setActionError(null);
    try {
      const data = await getAllEnrollments();
      setAllEnrollmentsData(data);
    } catch (err) {
      setErrorAll(err.message || 'Failed to load all enrollments.');
    } finally {
      setLoadingAll(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPending();
    } else if (activeTab === 'all') {
      fetchAll();
    }
  }, [activeTab, fetchPending, fetchAll]);

  const handleApprove = async (enrollmentId) => {
    setActionLoadingId(enrollmentId);
    setActionError(null);
    try {
      await approveEnrollment(enrollmentId);
      // Refresh the relevant list(s)
      fetchPending();
      if(activeTab === 'all') fetchAll(); // also refresh all if currently viewing it
    } catch (err) {
      setActionError(err.message || 'Failed to approve.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (enrollmentId) => {
    setActionLoadingId(enrollmentId);
    setActionError(null);
    try {
      await rejectEnrollment(enrollmentId);
      fetchPending();
      if(activeTab === 'all') fetchAll();
    } catch (err) {
      setActionError(err.message || 'Failed to reject.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderTable = (data, type) => {
    if ((type === 'pending' && loadingPending) || (type === 'all' && loadingAll)) {
      return <p className="text-center py-4">Loading data...</p>;
    }
    if ((type === 'pending' && errorPending) || (type === 'all' && errorAll)) {
      return <p className="text-center py-4 text-red-500">Error: {type === 'pending' ? errorPending : errorAll}</p>;
    }
    if (!data || data.length === 0) {
      return <p className="text-center py-4 text-gray-500">No enrollments to display.</p>;
    }

    return (
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
              {type === 'all' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>}
              {type === 'all' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>}
              {type === 'pending' && <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((enrollment) => (
              <tr key={enrollment._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enrollment.userId?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.userId?.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.courseId?.title || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(enrollment.requestedAt).toLocaleDateString()}</td>
                {type === 'all' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        enrollment.status === 'approved' ? 'bg-green-100 text-green-800' :
                        enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(enrollment.updatedAt).toLocaleDateString()}</td>
                  </>
                )}
                {type === 'pending' && (
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleApprove(enrollment._id)}
                      disabled={actionLoadingId === enrollment._id}
                      className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 px-3 py-1 rounded-md bg-indigo-100 hover:bg-indigo-200"
                    >
                      {actionLoadingId === enrollment._id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(enrollment._id)}
                      disabled={actionLoadingId === enrollment._id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 px-3 py-1 rounded-md bg-red-100 hover:bg-red-200"
                    >
                      {actionLoadingId === enrollment._id ? 'Processing...' : 'Reject'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Manage Course Enrollments</h1>

      {actionError && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-center text-sm">
            Action Error: {actionError}
        </div>
      )}

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`${
              activeTab === 'pending'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
          >
            Pending Approvals ({activeTab === 'pending' && !loadingPending ? pendingEnrollments.length : '...'})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`${
              activeTab === 'all'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
          >
            All Enrollments ({activeTab === 'all' && !loadingAll ? allEnrollmentsData.length : '...'})
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'pending' ? renderTable(pendingEnrollments, 'pending') : renderTable(allEnrollmentsData, 'all')}
      </div>
    </div>
  );
};

export default AdminEnrollmentManagementPage;
