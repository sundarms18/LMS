import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseForUser } from '../../api/courseApi';
import { getCourseProgress } from '../../api/progressApi'; // Import progress API

// Simple Disclosure/Accordion component - Open by default
const Disclosure = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-300 rounded-md mb-3 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors"
      >
        <span className="text-lg font-medium text-gray-800">{title}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && <div className="p-4 bg-white border-t border-gray-200">{children}</div>}
    </div>
  );
};

const UserSingleCoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [courseProgress, setCourseProgress] = useState({}); // { contentId: true/false }
  const [loading, setLoading] = useState(true); // Combined loading state for course and progress
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch course details and progress in parallel
        const [courseData, progressData] = await Promise.all([
          getCourseForUser(courseId),
          getCourseProgress(courseId)
        ]);

        setCourse(courseData);

        const progressMap = {};
        if (progressData) {
          progressData.forEach(item => {
            progressMap[item.contentId] = item.completed;
          });
        }
        setCourseProgress(progressMap);

      } catch (err) {
        setError(err.message || `Failed to fetch course data or progress (ID: ${courseId}).`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndProgress();
  }, [courseId]);

  const { totalContentItems, completedContentItems } = useMemo(() => {
    if (!course || !course.modules) return { totalContentItems: 0, completedContentItems: 0 };
    let total = 0;
    let completed = 0;
    course.modules.forEach(module => {
      if (module.content) {
        total += module.content.length;
        module.content.forEach(contentItem => {
          if (courseProgress[contentItem._id]) {
            completed++;
          }
        });
      }
    });
    return { totalContentItems: total, completedContentItems: completed };
  }, [course, courseProgress]);

  const progressPercentage = totalContentItems > 0 ? Math.round((completedContentItems / totalContentItems) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 text-center text-xl font-semibold text-gray-700">Loading course details...</div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <p className="text-red-500 text-xl mb-6">Error: {error}</p>
        <Link to="/courses" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          Back to Courses
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center p-10 text-xl text-gray-600">
        Course not found or you may not be enrolled.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex space-x-2">
          <li className="flex items-center">
            <Link to="/courses" className="text-indigo-600 hover:text-indigo-800">Browse Courses</Link>
          </li>
          <li className="flex items-center">
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-700 truncate max-w-md" title={course.title}>{course.title}</span>
          </li>
        </ol>
      </nav>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{course.title}</h1>
          <p className="text-gray-600 text-lg mb-4">
            Instructor: <span className="font-medium text-gray-800">{course.instructor?.name || 'N/A'}</span>
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {course.description || 'No description provided for this course.'}
          </p>

          {/* Overall Progress Bar */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-1">Your Progress:</h3>
            <div className="flex items-center mb-1">
              <div className="w-full bg-gray-200 rounded-full h-4 mr-2 shadow-inner">
                <div
                  className="bg-indigo-600 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-indigo-600">{progressPercentage}%</span>
            </div>
            <p className="text-xs text-gray-500 text-right">
              {completedContentItems} of {totalContentItems} items completed
            </p>
          </div>


          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 border-t pt-6">Modules</h2>
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((module, index) => (
              <Disclosure key={module._id} title={module.title} defaultOpen={index === 0}> {/* Open first module by default */}
                <p className="text-sm text-gray-600 mb-4">{module.description || 'No module description.'}</p>
                {module.content && module.content.length > 0 ? (
                  <ul className="space-y-2">
                    {module.content.map((contentItem) => {
                      const isCompleted = courseProgress[contentItem._id] || false;
                      return (
                        <li key={contentItem._id}
                            className={`p-3 border rounded-md transition-all duration-200 ease-in-out flex items-center justify-between
                                        ${isCompleted ? 'bg-green-50 border-green-300' : 'hover:bg-gray-50 border-gray-200'}`}
                        >
                          <Link
                            to={`/courses/${courseId}/content/${contentItem._id}`}
                            state={{ isCompleted: isCompleted, courseTitle: course.title /* For breadcrumb on content page */ }}
                            className="flex-grow text-indigo-700 hover:text-indigo-900"
                          >
                            <span className="font-medium">{contentItem.title}</span>
                          </Link>
                          <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                            {isCompleted && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span className={`text-xs uppercase px-2 py-0.5 rounded-full font-semibold tracking-wider
                                ${contentItem.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}
                            `}>
                                {contentItem.type}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No content items in this module yet.</p>
                )}
              </Disclosure>
            ))
          ) : (
            <p className="text-center text-gray-500">No modules available for this course.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSingleCoursePage;
