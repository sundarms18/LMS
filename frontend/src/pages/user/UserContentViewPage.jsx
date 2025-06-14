import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getContentForUser } from '../../api/courseApi';
import ReactMarkdown from 'react-markdown'; // For rendering markdown text content

const UserContentViewPage = () => {
  const { courseId, contentId } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await getContentForUser(contentId);
        setContent(data);
        setError(null);
      } catch (err) {
        setError(err.message || `Failed to fetch content (ID: ${contentId}).`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [contentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 text-center text-xl font-semibold text-gray-700">Loading content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <p className="text-red-500 text-xl mb-6">Error: {error}</p>
        <button
            onClick={() => navigate(-1)} // Go back to previous page (course details)
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mb-2"
        >
            Go Back
        </Link>
        <Link to="/courses" className="text-sm text-indigo-600 hover:text-indigo-800">
          Or, go to Courses List
        </Link>
      </div>
    );
  }

  if (!content) {
    return <div className="text-center p-10 text-xl text-gray-600">Content not found.</div>;
  }

  const renderContent = () => {
    if (content.type === 'video') {
      // Basic YouTube URL embed logic (can be made more robust for other video types)
      let videoUrl = content.url;
      if (videoUrl && videoUrl.includes('youtube.com/watch?v=')) {
        videoUrl = videoUrl.replace('watch?v=', 'embed/');
      } else if (videoUrl && videoUrl.includes('youtu.be/')) {
        videoUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
      }
      // Add other common video platform transformations if needed

      return (
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={videoUrl}
            title={content.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg shadow-lg"
          ></iframe>
        </div>
      );
    } else if (content.type === 'text') {
      return (
        <div className="prose lg:prose-xl max-w-none bg-white p-6 rounded-lg shadow">
          <ReactMarkdown>{content.text_content || ''}</ReactMarkdown>
        </div>
      );
    }
    return <p className="text-gray-600">Unsupported content type.</p>;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <nav className="mb-8 text-sm" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex space-x-2 items-center text-gray-600">
          <li><Link to="/courses" className="hover:text-indigo-600">Courses</Link></li>
          <li><span className="mx-1">/</span></li>
          <li>
            <Link to={`/courses/${courseId}`} className="hover:text-indigo-600 truncate max-w-xs">
              {/* Ideally, pass course title via state from previous page for breadcrumb */}
              Course Details
            </Link>
          </li>
          <li><span className="mx-1">/</span></li>
          <li className="text-gray-800 font-medium truncate max-w-xs" aria-current="page">
            {content.title}
          </li>
        </ol>
      </nav>

      <article>
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{content.title}</h1>
        </header>
        {renderContent()}
      </article>

      <div className="mt-10 text-center">
        <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
            Back to Course Modules
        </button>
      </div>
    </div>
  );
};

export default UserContentViewPage;
