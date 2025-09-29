import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, Play, FileText, CheckCircle, ArrowRight, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  type: 'video' | 'text';
  duration: number;
  order: number;
}

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: {
    name: string;
  };
  modules: Module[];
}

const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchCourse();
      if (user) {
        checkEnrollmentStatus();
      }
    }
  }, [slug, user]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/${slug}`);
      setCourse(response.data.course);
    } catch (err) {
      setError('Course not found');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${user?.id}/enrollments`);
      const enrollment = response.data.enrollments.find((e: any) => e.course.slug === slug);
      if (enrollment) {
        setEnrollmentStatus(enrollment.status);
      }
    } catch (err) {
      console.error('Error checking enrollment:', err);
    }
  };

  const handleEnroll = async () => {
    if (!user || !course) return;

    try {
      setEnrolling(true);
      await axios.post(`${API_URL}/courses/${course._id}/enroll`);
      setEnrollmentStatus('pending');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const getTotalDuration = () => {
    if (!course) return 0;
    return course.modules.reduce((total, module) => {
      return total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + lesson.duration, 0);
    }, 0);
  };

  const getTotalLessons = () => {
    if (!course) return 0;
    return course.modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
          <Link
            to="/courses"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const renderEnrollmentButton = () => {
    if (!user) {
      return (
        <Link
          to="/login"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 inline-flex items-center space-x-2"
        >
          <span>Login to Enroll</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      );
    }

    if (user.status === 'pending') {
      return (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
          Account pending approval
        </div>
      );
    }

    switch (enrollmentStatus) {
      case 'pending':
        return (
          <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-lg flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Enrollment pending approval</span>
          </div>
        );
      case 'active':
        return (
          <div className="flex items-center space-x-2">
            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Enrolled</span>
            </div>
            {course.modules.length > 0 && course.modules[0].lessons.length > 0 && (
              <Link
                to={`/lesson/${course._id}/${course.modules[0].lessons[0]._id}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                {/* Check if user has any progress */}
                Start Learning
              </Link>
            )}
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-100 text-red-800 px-6 py-3 rounded-lg flex items-center space-x-2">
            <span>❌</span>
            <span>Enrollment rejected</span>
          </div>
        );
      default:
        return (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
          >
            {enrolling ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Enrolling...</span>
              </>
            ) : (
              <>
                <span>Enroll Now</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="lg:flex">
            {/* Course Image */}
            <div className="lg:w-1/2">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 lg:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-white opacity-80" />
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="lg:w-1/2 p-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>

              <div className="flex items-center space-x-2 mb-6">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Instructor: {course.instructor.name}</span>
              </div>

              {/* Course Stats */}
              <div className="flex items-center space-x-6 text-gray-600 mb-8">
                <div className="flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>{getTotalLessons()} lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{getTotalDuration()} minutes</span>
                </div>
              </div>

              {/* Enrollment Button */}
              {renderEnrollmentButton()}
            </div>
          </div>
        </div>

        {/* Course Modules */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
          
          {course.modules.length === 0 ? (
            <p className="text-gray-500">No modules available yet.</p>
          ) : (
            <div className="space-y-6">
              {course.modules
                .sort((a, b) => a.order - b.order)
                .map((module) => (
                  <div key={module._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-gray-600">{module.description}</p>
                      )}
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {module.lessons
                        .sort((a, b) => a.order - b.order)
                        .map((lesson) => (
                          <div key={lesson._id} className="px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {lesson.type === 'video' ? (
                                <Play className="h-5 w-5 text-blue-600" />
                              ) : (
                                <FileText className="h-5 w-5 text-green-600" />
                              )}
                              <div>
                                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                {lesson.description && (
                                  <p className="text-sm text-gray-600">{lesson.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{lesson.duration} min</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;