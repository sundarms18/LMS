import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, ArrowLeft, ArrowRight, Play, FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  type: 'video' | 'text';
  content?: string;
  youtubeVideoId?: string;
  duration: number;
  order: number;
}

interface Module {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  modules: Module[];
}

interface Enrollment {
  _id: string;
  status: string;
  completedLessons: Array<{ lesson: string; completedAt: string }>;
  progress: number;
}

const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseId && lessonId && user) {
      fetchCourseData();
      fetchEnrollment();
    }
  }, [courseId, lessonId, user]);

  useEffect(() => {
    if (currentLesson?.type === 'video' && currentLesson.youtubeVideoId) {
      fetchVideoUrl(currentLesson.youtubeVideoId);
    }
  }, [currentLesson]);

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/courses`);
      const foundCourse = response.data.courses.find((c: any) => c._id === courseId);
      
      if (foundCourse) {
        // Populate modules with lessons
        const populatedCourse = await axios.get(`${API_URL}/courses/${foundCourse.slug}`);
        setCourse(populatedCourse.data.course);
        
        // Find current lesson
        for (const module of populatedCourse.data.course.modules) {
          const lesson = module.lessons.find((l: Lesson) => l._id === lessonId);
          if (lesson) {
            setCurrentLesson(lesson);
            break;
          }
        }
      }
    } catch (err) {
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollment = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${user?.id}/enrollments`);
      const foundEnrollment = response.data.enrollments.find((e: any) => e.course._id === courseId);
      setEnrollment(foundEnrollment);
    } catch (err) {
      console.error('Error fetching enrollment:', err);
    }
  };

  const fetchVideoUrl = async (videoId: string) => {
    try {
      const response = await axios.get(`${API_URL}/videos/embed/${videoId}?courseId=${courseId}`);
      setVideoUrl(response.data.embedUrl);
    } catch (err) {
      console.error('Error fetching video URL:', err);
    }
  };

  const markAsComplete = async () => {
    if (!enrollment || !currentLesson) return;

    try {
      setCompleting(true);
      const response = await axios.post(`${API_URL}/enrollments/${enrollment._id}/lessons/${currentLesson._id}/complete`);
      
      // Update enrollment state
      const updatedEnrollment = { ...enrollment };
      updatedEnrollment.completedLessons.push({
        lesson: currentLesson._id,
        completedAt: new Date().toISOString()
      });
      updatedEnrollment.progress = response.data.progress;
      updatedEnrollment.status = response.data.status;
      setEnrollment(updatedEnrollment);
      
      // Show success message if course completed
      if (response.data.status === 'completed') {
        alert('🎉 Congratulations! You have completed the course!');
      }
    } catch (err: any) {
      console.error('Error marking lesson as complete:', err);
      setError(err.response?.data?.message || 'Failed to mark lesson as complete');
    } finally {
      setCompleting(false);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.completedLessons.some(cl => cl.lesson === lessonId) || false;
  };

  const getNavigationData = () => {
    if (!course || !currentLesson) return { prev: null, next: null };

    const allLessons: Array<{ lesson: Lesson; moduleTitle: string }> = [];
    
    course.modules
      .sort((a, b) => a.order - b.order)
      .forEach(module => {
        module.lessons
          .sort((a, b) => a.order - b.order)
          .forEach(lesson => {
            allLessons.push({ lesson, moduleTitle: module.title });
          });
      });

    const currentIndex = allLessons.findIndex(item => item.lesson._id === currentLesson._id);
    
    return {
      prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Lesson not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (enrollment?.status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-600 mb-4">Enrollment not active</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { prev, next } = getNavigationData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">Progress: {enrollment?.progress || 0}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isLessonCompleted(currentLesson._id) && (
                <button
                  onClick={markAsComplete}
                  disabled={completing}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {completing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Marking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Mark Complete</span>
                    </>
                  )}
                </button>
              )}
              
              {isLessonCompleted(currentLesson._id) && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Lesson Header */}
              <div className="p-6 border-b">
                <div className="flex items-center space-x-3 mb-2">
                  {currentLesson.type === 'video' ? (
                    <Play className="h-6 w-6 text-blue-600" />
                  ) : (
                    <FileText className="h-6 w-6 text-green-600" />
                  )}
                  <h2 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h2>
                </div>
                {currentLesson.description && (
                  <p className="text-gray-600">{currentLesson.description}</p>
                )}
              </div>

              {/* Lesson Content */}
              <div className="p-6">
                {currentLesson.type === 'video' && videoUrl ? (
                  <div className="aspect-video">
                    <iframe
                      src={videoUrl}
                      title={currentLesson.title}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                ) : currentLesson.type === 'text' && currentLesson.content ? (
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                  />
                ) : (
                  <p className="text-gray-500">Content not available</p>
                )}
              </div>

              {/* Navigation */}
              <div className="p-6 border-t bg-gray-50 flex justify-between">
                <div>
                  {prev && (
                    <button
                      onClick={() => navigate(`/lesson/${courseId}/${prev.lesson._id}`)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <div className="text-left">
                        <div className="text-sm text-gray-500">Previous</div>
                        <div className="font-medium">{prev.lesson.title}</div>
                      </div>
                    </button>
                  )}
                </div>
                
                <div>
                  {next && (
                    <button
                      onClick={() => navigate(`/lesson/${courseId}/${next.lesson._id}`)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Next</div>
                        <div className="font-medium">{next.lesson.title}</div>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Course Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
              
              <div className="space-y-4">
                {course.modules
                  .sort((a, b) => a.order - b.order)
                  .map((module) => (
                    <div key={module._id}>
                      <h4 className="font-medium text-gray-900 mb-2">{module.title}</h4>
                      <div className="space-y-1 ml-4">
                        {module.lessons
                          .sort((a, b) => a.order - b.order)
                          .map((lesson) => (
                            <button
                              key={lesson._id}
                              onClick={() => navigate(`/lesson/${courseId}/${lesson._id}`)}
                              className={`w-full text-left p-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-gray-50 ${
                                lesson._id === currentLesson._id ? 'bg-blue-50 text-blue-700' : ''
                              }`}
                            >
                              {isLessonCompleted(lesson._id) ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : lesson.type === 'video' ? (
                                <Play className="h-4 w-4 text-gray-400" />
                              ) : (
                                <FileText className="h-4 w-4 text-gray-400" />
                              )}
                              <span>{lesson.title}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;