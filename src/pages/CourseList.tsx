import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Clock, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: {
    name: string;
  };
  slug: string;
  enrollmentCount: number;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data.courses);
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCourses}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover a wide range of courses designed to help you learn new skills and advance your career.
          </p>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">No courses available</h3>
            <p className="text-gray-400">Check back soon for new courses!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
                {/* Course Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-16 w-16 text-white opacity-80" />
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Course Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrollmentCount} enrolled</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>By {course.instructor.name}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/courses/${course.slug}`}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;