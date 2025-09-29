import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, Award, Play, CheckCircle, TrendingUp } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Enrollment {
  _id: string;
  status: string;
  progress: number;
  enrolledAt: string;
  course: {
    _id: string;
    title: string;
    description: string;
    thumbnail?: string;
    slug: string;
  };
  completedLessons: Array<{
    lesson: string;
    completedAt: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${user?.id}/enrollments`);
      setEnrollments(response.data.enrollments);
    } catch (err) {
      setError('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      pending: 'Pending Approval',
      active: 'Active',
      rejected: 'Rejected',
      completed: 'Completed'
    };
    
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');
  const averageProgress = activeEnrollments.length > 0 
    ? activeEnrollments.reduce((acc, e) => acc + e.progress, 0) / activeEnrollments.length 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Track your learning progress and continue your journey.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-semibold text-gray-900">{enrollments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Play className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{activeEnrollments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{completedEnrollments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{Math.round(averageProgress)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollments */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
              <Link
                to="/courses"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Browse Courses
              </Link>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {enrollments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-500 mb-2">No enrollments yet</h3>
                <p className="text-gray-400 mb-6">Start your learning journey by enrolling in a course!</p>
                <Link
                  to="/courses"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Explore Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                  <div key={enrollment._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Course Image */}
                    <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                      {enrollment.course.thumbnail ? (
                        <img
                          src={enrollment.course.thumbnail}
                          alt={enrollment.course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="h-12 w-12 text-white opacity-80" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(enrollment.status)}`}>
                        {getStatusText(enrollment.status)}
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {enrollment.course.description}
                      </p>

                      {/* Progress Bar */}
                      {enrollment.status === 'active' && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{enrollment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      {enrollment.status === 'active' ? (
                        <Link
                          to={`/courses/${enrollment.course.slug}`}
                          className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          {enrollment.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                        </Link>
                      ) : enrollment.status === 'completed' ? (
                        <div className="flex items-center justify-center space-x-2 text-green-600 py-2">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Completed</span>
                        </div>
                      ) : enrollment.status === 'pending' ? (
                        <div className="text-center text-yellow-600 py-2 bg-yellow-50 rounded-lg">
                          <span className="font-medium">Waiting for approval</span>
                        </div>
                      ) : (
                        <div className="text-center text-red-600 py-2 bg-red-50 rounded-lg">
                          <span className="font-medium">Enrollment rejected</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;