import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, UserCheck, GraduationCap, Eye } from 'lucide-react';
import CourseManagement from '../components/CourseManagement';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface User {
  _id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  isPublished: boolean;
  instructor: {
    name: string;
  };
  enrollmentCount: number;
}

interface Enrollment {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  course: {
    title: string;
  };
  status: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<Enrollment[]>([]);
  const [selectedCourseProgress, setSelectedCourseProgress] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchStatistics();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchCourses(),
        fetchEnrollments(),
        fetchPendingUsers(),
        fetchPendingEnrollments()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/courses`);
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/enrollments`);
      setEnrollments(response.data.enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users?status=pending`);
      setPendingUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const fetchPendingEnrollments = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/enrollments?status=pending`);
      setPendingEnrollments(response.data.enrollments);
    } catch (error) {
      console.error('Error fetching pending enrollments:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/statistics`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchCourseProgress = async (courseId: string) => {
    try {
      const response = await axios.get(`${API_URL}/admin/progress/${courseId}`);
      setSelectedCourseProgress(response.data);
    } catch (error) {
      console.error('Error fetching course progress:', error);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      await axios.patch(`${API_URL}/admin/users/${userId}/approve`);
      fetchPendingUsers();
      fetchUsers();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      await axios.patch(`${API_URL}/admin/users/${userId}/reject`);
      fetchPendingUsers();
      fetchUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const approveEnrollment = async (enrollmentId: string) => {
    try {
      await axios.patch(`${API_URL}/admin/enrollments/${enrollmentId}/approve`);
      fetchPendingEnrollments();
      fetchEnrollments();
    } catch (error) {
      console.error('Error approving enrollment:', error);
    }
  };

  const rejectEnrollment = async (enrollmentId: string) => {
    try {
      await axios.patch(`${API_URL}/admin/enrollments/${enrollmentId}/reject`);
      fetchPendingEnrollments();
      fetchEnrollments();
    } catch (error) {
      console.error('Error rejecting enrollment:', error);
    }
  };


  const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, courses, and enrollments</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'users', label: 'Users' },
              { key: 'courses', label: 'Courses' },
              { key: 'enrollments', label: 'Enrollments' },
              { key: 'progress', label: 'Progress Tracking' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={statistics?.users?.total || users.length}
                icon={<Users className="h-6 w-6 text-blue-600" />}
                color="bg-blue-100"
              />
              <StatCard
                title="Total Courses"
                value={statistics?.courses?.total || courses.length}
                icon={<BookOpen className="h-6 w-6 text-green-600" />}
                color="bg-green-100"
              />
              <StatCard
                title="Pending Users"
                value={statistics?.users?.pending || pendingUsers.length}
                icon={<UserCheck className="h-6 w-6 text-yellow-600" />}
                color="bg-yellow-100"
              />
              <StatCard
                title="Pending Enrollments"
                value={statistics?.enrollments?.pending || pendingEnrollments.length}
                icon={<GraduationCap className="h-6 w-6 text-purple-600" />}
                color="bg-purple-100"
              />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published Courses:</span>
                    <span className="font-medium">{statistics?.courses?.published || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Courses:</span>
                    <span className="font-medium">{statistics?.courses?.total || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Enrollments:</span>
                    <span className="font-medium text-green-600">{statistics?.enrollments?.active || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium text-blue-600">{statistics?.enrollments?.completed || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Users:</span>
                    <span className="font-medium text-green-600">{statistics?.users?.active || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Users:</span>
                    <span className="font-medium">{statistics?.users?.total || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Users */}
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Pending User Approvals</h3>
                </div>
                <div className="p-6">
                  {pendingUsers.length === 0 ? (
                    <p className="text-gray-500">No pending user approvals</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingUsers.slice(0, 5).map((user) => (
                        <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => approveUser(user._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectUser(user._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pending Enrollments */}
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Enrollments</h3>
                </div>
                <div className="p-6">
                  {pendingEnrollments.length === 0 ? (
                    <p className="text-gray-500">No pending enrollments</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingEnrollments.slice(0, 5).map((enrollment) => (
                        <div key={enrollment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{enrollment.user.name}</p>
                            <p className="text-sm text-gray-600">{enrollment.course.title}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => approveEnrollment(enrollment._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectEnrollment(enrollment._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => approveUser(user._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <CourseManagement
            courses={courses}
            fetchCourses={fetchCourses}
            onViewCourseProgress={fetchCourseProgress}
          />
        )}

        {/* Enrollments Tab */}
        {activeTab === 'enrollments' && (
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">All Enrollments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{enrollment.user.name}</div>
                          <div className="text-sm text-gray-500">{enrollment.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment.course.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          enrollment.status === 'active' ? 'bg-green-100 text-green-800' :
                          enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          enrollment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {enrollment.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => approveEnrollment(enrollment._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectEnrollment(enrollment._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Progress Tracking Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Course Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Course to View Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.filter(course => course.isPublished).map((course) => (
                  <button
                    key={course._id}
                    onClick={() => fetchCourseProgress(course._id)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 text-left"
                  >
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {course.enrollmentCount} enrolled
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Course Progress Details */}
            {selectedCourseProgress && (
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Progress for: {selectedCourseProgress.course.title}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Lessons</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedCourseProgress.enrollments.map((enrollment: any) => (
                        <tr key={enrollment._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{enrollment.user.name}</div>
                              <div className="text-sm text-gray-500">{enrollment.user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                                  style={{ width: `${enrollment.progressPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {enrollment.progressPercentage}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {enrollment.completedLessonsCount} / {enrollment.totalLessons}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              enrollment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {enrollment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;