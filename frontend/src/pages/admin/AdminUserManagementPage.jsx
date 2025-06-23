import React, { useState, useEffect } from 'react'; // Removed useContext
import { getUsers, approveUser } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext'; // Changed to useAuth

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingUserId, setApprovingUserId] = useState(null); // To disable button during API call

  const { user } = useAuth(); // Changed to useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // TODO: Add check to ensure only admin can access this page,
    // though ProtectedRoute should handle this.
    // For now, directly fetch users.
    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    setApprovingUserId(userId);
    setError(null);
    try {
      const updatedUser = await approveUser(userId);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, isApproved: updatedUser.isApproved } : u))
      );
    } catch (err) {
      setError(err.message || 'Failed to approve user.');
      console.error(err);
    } finally {
      setApprovingUserId(null);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">User Management</h1>
      {users.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Name</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Email</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-center">Status</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4 text-center">
                    {u.isApproved ? (
                      <span className="bg-green-500 text-white py-1 px-3 rounded-full text-xs">Approved</span>
                    ) : (
                      <span className="bg-yellow-500 text-white py-1 px-3 rounded-full text-xs">Pending Approval</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {!u.isApproved && (
                      <button
                        onClick={() => handleApprove(u._id)}
                        disabled={approvingUserId === u._id}
                        className={`py-2 px-4 rounded-lg font-semibold text-white
                                    ${approvingUserId === u._id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                      >
                        {approvingUserId === u._id ? 'Approving...' : 'Approve'}
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

export default AdminUserManagementPage;
