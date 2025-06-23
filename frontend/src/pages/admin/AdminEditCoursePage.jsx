import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link
import AdminCourseForm from '../../components/admin/forms/AdminCourseForm';
import AdminModuleForm from '../../components/admin/forms/AdminModuleForm'; // Added AdminModuleForm
import {
  getCourseDetails,
  updateCourse,
  createModule, // Added module APIs
  updateModule,
  deleteModule
} from '../../api/adminApi';
import {
  getUserProgressForCourse,
  getCourseProgressAllUsers
} from '../../api/adminProgressApi'; // Import admin progress APIs
import { useCallback } from 'react'; // Import useCallback

const AdminEditCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Existing state for course details and modules
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true); // General loading for course data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModuleSubmitting, setIsModuleSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [moduleError, setModuleError] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  // New state for tabs and progress
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'modules', 'progress'

  const [studentProgressSummary, setStudentProgressSummary] = useState([]);
  const [detailedUserProgress, setDetailedUserProgress] = useState([]);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState(null); // { id, name }

  const [loadingProgressSummary, setLoadingProgressSummary] = useState(false);
  const [loadingDetailedProgress, setLoadingDetailedProgress] = useState(false);
  const [errorProgress, setErrorProgress] = useState(null);


  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) return;
    setLoading(true); // For course details
    setFetchError(null);
    try {
      const data = await getCourseDetails(courseId);
      setCourseData(data);
    } catch (err) {
      setFetchError(err.message || `Failed to fetch course details for ID ${courseId}.`);
      console.error('Failed to fetch course:', err);
      setCourseData(null);
    } finally {
      setLoading(false); // For course details
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  // Fetch student progress summary when 'progress' tab is active or courseData changes (for total content items)
  const fetchStudentProgressSummary = useCallback(async () => {
    if (!courseId || !courseData) return;
    setLoadingProgressSummary(true);
    setErrorProgress(null);
    try {
      const progressData = await getCourseProgressAllUsers(courseId);
      // Calculate summary
      const summary = {};
      const totalContentItemsInCourse = courseData.modules.reduce((acc, module) => acc + (module.content?.length || 0), 0);

      progressData.forEach(p => {
        if (!p.userId) return; // Skip if userId is null/undefined
        const userId = p.userId._id;
        if (!summary[userId]) {
          summary[userId] = {
            userId: p.userId._id,
            userName: p.userId.name,
            userEmail: p.userId.email,
            completedCount: 0,
            totalCount: totalContentItemsInCourse, // All users have same total for this course
          };
        }
        if (p.completed) {
          summary[userId].completedCount++;
        }
      });

      setStudentProgressSummary(Object.values(summary).map(s => ({
        ...s,
        percentage: s.totalCount > 0 ? Math.round((s.completedCount / s.totalCount) * 100) : 0,
      })));

    } catch (err) {
      setErrorProgress(err.message || 'Failed to load student progress summary.');
      console.error('Student Progress Summary Error:', err);
    } finally {
      setLoadingProgressSummary(false);
    }
  }, [courseId, courseData]); // Depend on courseData for totalContentItemsInCourse

  // Fetch detailed progress for a selected student
  const fetchDetailedStudentProgress = useCallback(async () => {
    if (!selectedStudentForDetail || !courseId) return;
    setLoadingDetailedProgress(true);
    setErrorProgress(null);
    try {
      const detailedData = await getUserProgressForCourse(selectedStudentForDetail.id, courseId);
      // We need to map this to all content items in the course
      const allCourseContent = courseData.modules.flatMap(m => m.content.map(c => ({...c, moduleTitle: m.title})));
      const progressMap = new Map(detailedData.map(p => [p.contentId._id, p.completed]));

      const enrichedDetailedProgress = allCourseContent.map(content => ({
        contentId: content._id,
        contentTitle: content.title,
        moduleTitle: content.moduleTitle,
        completed: progressMap.get(content._id) || false,
      }));
      setDetailedUserProgress(enrichedDetailedProgress);

    } catch (err) {
      setErrorProgress(err.message || `Failed to load detailed progress for ${selectedStudentForDetail.name}.`);
      console.error('Detailed Student Progress Error:', err);
    } finally {
      setLoadingDetailedProgress(false);
    }
  }, [selectedStudentForDetail, courseId, courseData]);

  useEffect(() => {
    if (activeTab === 'progress' && !selectedStudentForDetail) {
      fetchStudentProgressSummary();
    }
    if (activeTab === 'progress' && selectedStudentForDetail) {
      fetchDetailedStudentProgress();
    }
  }, [activeTab, fetchStudentProgressSummary, fetchDetailedStudentProgress, selectedStudentForDetail]);


  const handleCourseSubmit = async (updatedCourseData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { title, description } = updatedCourseData;
      await updateCourse(courseId, { title, description });
      setCourseData(prev => ({ ...prev, title, description })); // Update local state
      alert('Course details updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCourseEditCancel = () => navigate('/admin/courses');

  // --- Module Action Handlers (keep existing) ---
  const handleOpenModuleForm = (moduleItem = null) => {
    setEditingModule(moduleItem);
    setShowModuleForm(true);
    setModuleError(null);
  };

  const handleCloseModuleForm = () => {
    setShowModuleForm(false);
    setEditingModule(null);
    setModuleError(null);
  };

  const handleModuleFormSubmit = async (moduleFormData) => {
    setIsModuleSubmitting(true);
    setModuleError(null);
    try {
      if (editingModule && editingModule._id) {
        await updateModule(editingModule._id, moduleFormData);
      } else {
        await createModule(courseId, moduleFormData);
      }
      await fetchCourseDetails(); // Re-fetch course details (which includes modules)
      handleCloseModuleForm();
    } catch (err) {
      setModuleError(err.message || 'Failed to save module.');
    } finally {
      setIsModuleSubmitting(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      try {
        await deleteModule(moduleId);
        await fetchCourseDetails(); // Re-fetch
      } catch (err) {
        alert(`Error deleting module: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const handleViewStudentDetail = (student) => {
    setSelectedStudentForDetail({id: student.userId, name: student.userName});
  };

  const handleBackToSummary = () => {
    setSelectedStudentForDetail(null);
    setDetailedUserProgress([]); // Clear detailed view
    // Optionally re-fetch summary if data might have changed significantly,
    // but usually not needed just for navigating views.
    // fetchStudentProgressSummary();
  };


  if (loading) { // This is for initial course data loading
    return <div className="text-center p-4">Loading course details...</div>;
  }

  if (fetchError || !courseData) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500 mb-4">{fetchError || 'Course not found.'}</p>
        <button
          onClick={() => navigate('/admin/courses')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Course List
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Course Details</h2>
                 {/* Back to Course List button can remain or be part of a top-level header for the page */}
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong> <span className="block sm:inline">{error}</span>
              </div>
            )}
            <AdminCourseForm
              initialData={{ title: courseData.title, description: courseData.description }}
              onSubmit={handleCourseSubmit}
              isSubmitting={isSubmitting}
              onCancel={null}
            />
          </div>
        );
      case 'modules':
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Modules</h2>
              <button
                onClick={() => handleOpenModuleForm()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add New Module
              </button>
            </div>
            {moduleError && ( <div className="text-red-500 mb-3">Module operation error: {moduleError}</div>)}
            {courseData.modules && courseData.modules.length > 0 ? (
              <ul className="space-y-4">
                {courseData.modules.map((module) => (
                  <li key={module._id} className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{module.description || 'No description.'}</p>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0 mt-1 sm:mt-0">
                        <button onClick={() => handleOpenModuleForm(module)} className="text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Edit</button>
                        <Link to={`/admin/modules/${module._id}/content`} state={{ module: module, courseId: courseData._id }} className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Manage Content</Link>
                        <button onClick={() => handleDeleteModule(module._id)} className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : ( <p className="text-center text-gray-500">No modules yet.</p> )}
          </div>
        );
      case 'progress':
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Student Progress</h2>
            {errorProgress && <div className="text-red-500 mb-3">Error loading progress: {errorProgress}</div>}

            {selectedStudentForDetail ? (
              <div>
                <button onClick={handleBackToSummary} className="mb-4 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded">
                  &larr; Back to Progress Summary
                </button>
                <h3 className="text-lg font-medium mb-2">Detailed Progress for: {selectedStudentForDetail.name}</h3>
                {loadingDetailedProgress ? <p>Loading details...</p> : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Content Title</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {detailedUserProgress.map(item => (
                          <tr key={item.contentId}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.moduleTitle}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.contentTitle}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {item.completed ?
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span> :
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Not Completed</span>
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              loadingProgressSummary ? <p>Loading summary...</p> :
              studentProgressSummary.length === 0 && !loadingProgressSummary ? <p>No student progress data available for this course yet.</p> :
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentProgressSummary.map(student => (
                      <tr key={student.userId}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{student.userName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{student.userEmail}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{student.completedCount} / {student.totalCount}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${student.percentage}%`}}></div>
                          </div>
                           {student.percentage}%
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <button onClick={() => handleViewStudentDetail(student)} className="text-indigo-600 hover:text-indigo-800 text-xs">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Course: <span className="text-indigo-600">{courseData?.title || ''}</span>
        </h1>
        <button
            onClick={handleCourseEditCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
            Back to Course List
        </button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['details', 'modules', 'progress'].map((tabName) => (
            <button
              key={tabName}
              onClick={() => setActiveTab(tabName)}
              className={`${
                activeTab === tabName
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm focus:outline-none capitalize`}
            >
              {tabName}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        {renderTabContent()}
      </div>

      {/* Module Form Modal (remains unchanged) */}
      {showModuleForm && (
        <AdminModuleForm
          initialData={editingModule}
          onSubmit={handleModuleFormSubmit}
          onCancel={handleCloseModuleForm}
          isSubmitting={isModuleSubmitting}
        />
      )}
      {/* Module Error Toast (remains unchanged) */}
      {moduleError && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
            <strong className="font-bold">Module Error: </strong>
            <span className="block sm:inline">{moduleError}</span>
          </div>
        )}
    </div>
  );
};

export default AdminEditCoursePage;
