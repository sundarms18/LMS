import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseForUser } from '../../api/courseApi';

// Simple Disclosure/Accordion component
const Disclosure = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-300 rounded-md mb-3 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none"
      >
        <span className="text-lg font-medium text-gray-800">{title}</span>
        <span>{isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}</span>
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
};

const UserSingleCoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseForUser(courseId);
        setCourse(data);
        setError(null);
      } catch (err) {
        setError(err.message || `Failed to fetch course (ID: ${courseId}).`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

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
        Course not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex space-x-2">
          <li className="flex items-center">
            <Link to="/courses" className="text-indigo-600 hover:text-indigo-800">Courses</Link>
          </li>
          <li className="flex items-center">
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-700">{course.title}</span>
          </li>
        </ol>
      </nav>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{course.title}</h1>
          <p className="text-gray-600 text-lg mb-4">
            Instructor: <span className="font-medium text-gray-800">{course.instructor?.name || 'N/A'}</span>
          </p>
          <p className="text-gray-700 mb-8 leading-relaxed">
            {course.description || 'No description provided for this course.'}
          </p>

          <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-t pt-6">Modules</h2>
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((module) => (
              <Disclosure key={module._id} title={module.title}>
                <p className="text-sm text-gray-600 mb-4">{module.description || 'No module description.'}</p>
                {module.content && module.content.length > 0 ? (
                  <ul className="space-y-3">
                    {module.content.map((contentItem) => (
                      <li key={contentItem._id} className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                        <Link
                          to={`/courses/${courseId}/content/${contentItem._id}`}
                          className="flex items-center justify-between text-indigo-700 hover:text-indigo-900"
                        >
                          <span className="font-medium">{contentItem.title}</span>
                          <span className="text-xs uppercase px-2 py-1 rounded-full font-semibold tracking-wider
                            ${contentItem.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}
                          `}>
                            {contentItem.type}
                          </span>
                        </Link>
                      </li>
                    ))}
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
