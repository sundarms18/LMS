import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth(); // To ensure API calls are made when token is available

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) { // Only fetch if token is present (user is logged in as admin)
      fetchUsers();
    }
  }, [fetchUsers, token]);

  const handleApproveUser = async (userId) => {
    setError('');
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/approve`);
      // Update local state to reflect approval
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isApproved: true } : user
        )
      );
      // Or re-fetch: await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to approve user ${userId}.`);
      console.error(err);
    }
  };

  if (loading) return <p className="text-center p-4">Loading users...</p>;
  if (error) return <p className="text-center text-red-500 p-4">Error: {error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">User Management</h2>
      {users.length === 0 ? <p>No users found.</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.isApproved ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!user.isApproved && (
                      <button
                        onClick={() => handleApproveUser(user._id)}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                        disabled={user.isApproved}
                      >
                        Approve
                      </button>
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

export default UserManagement;
