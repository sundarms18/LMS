import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getContentForUser } from '../../api/courseApi';
import { toggleContentCompletion } from '../../api/progressApi'; // Import progress API
import ReactMarkdown from 'react-markdown';

const UserContentViewPage = () => {
  const { courseId, contentId } = useParams();
  const location = useLocation(); // To get initialIsCompleted from route state
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Progress related state
  const initialCompletedState = location.state?.isCompleted || false;
  const [isCompleted, setIsCompleted] = useState(initialCompletedState);
  const [loadingCompletionToggle, setLoadingCompletionToggle] = useState(false);
  const [toggleError, setToggleError] = useState(null); // Error specific to toggle action

  useEffect(() => {
    // Update isCompleted if initialCompletedState changes (e.g., navigating back and forth)
    setIsCompleted(location.state?.isCompleted || false);
  }, [location.state?.isCompleted]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true); // Ensure loading is true at the start of fetch
      setError(null); // Clear previous errors
      setToggleError(null); // Clear previous toggle errors
      try {
        const data = await getContentForUser(contentId);
        setContent(data);
      } catch (err) {
        setError(err.message || `Failed to fetch content (ID: ${contentId}).`);
        console.error('Fetch Content Error:', err);
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

  const handleToggleCompletion = async () => {
    setLoadingCompletionToggle(true);
    setToggleError(null);
    try {
      const updatedProgress = await toggleContentCompletion(contentId);
      setIsCompleted(updatedProgress.completed);
    } catch (err) {
      setToggleError(err.message || 'Failed to update completion status.');
      console.error('Toggle Completion Error:', err);
    } finally {
      setLoadingCompletionToggle(false);
    }
  };

  // Utility function to extract YouTube Video ID and construct embed URL
  const getYouTubeEmbedUrl = (urlInput) => {
    if (!urlInput) return null;

    let videoId = null;

    // Standard URL: https://www.youtube.com/watch?v=VIDEO_ID
    let match = urlInput.match(/[?&]v=([^&]+)/);
    if (match) {
      videoId = match[1];
    } else {
      // Shortened URL: https://youtu.be/VIDEO_ID
      match = urlInput.match(/youtu\.be\/([^?&]+)/);
      if (match) {
        videoId = match[1];
      } else {
        // Embed URL: https://www.youtube.com/embed/VIDEO_ID
        match = urlInput.match(/\/embed\/([^?&]+)/);
        if (match) {
          videoId = match[1]; // Already in correct embed format, but we just need ID
        } else {
          // Direct Video ID (assuming it's an 11-character alphanumeric string, possibly with -_):
          // This regex is a common pattern for YouTube IDs.
          if (/^[a-zA-Z0-9_-]{11}$/.test(urlInput)) {
            videoId = urlInput;
          }
        }
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Fallback: if it's a generic URL that might be embeddable (e.g. not YouTube but some other platform)
    // or if the admin pasted a direct MP4 link (though iframe might not be best for that)
    // For this task, we'll focus on YouTube. If it's not a recognized YouTube format, we'll consider it invalid for iframe.
    // console.warn("Could not extract YouTube video ID from URL:", urlInput);
    return null; // Return null if no valid YouTube ID found
  };


  const renderContent = () => {
    if (content.type === 'video') {
      const embedUrl = getYouTubeEmbedUrl(content.url);

      if (embedUrl) {
        return (
          <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg shadow-xl overflow-hidden"> {/* Added bg-black for letterboxing */}
            <iframe
              src={embedUrl}
              title={content.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full" // Ensure iframe takes full space of aspect ratio container
            ></iframe>
          </div>
        );
      } else {
        return (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow" role="alert">
            <p className="font-bold">Video Error</p>
            <p>The video could not be loaded. The URL might be invalid, not a YouTube link, or the video may be private.</p>
          </div>
        );
      }
    } else if (content.type === 'text') {
      return (
        <div className="prose lg:prose-xl max-w-none bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <ReactMarkdown>{content.text_content || '*No text content provided.*'}</ReactMarkdown>
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

        <div className="mt-8 pt-6 border-t border-gray-200">
          {toggleError && (
            <p className="text-sm text-red-600 mb-3 text-center bg-red-100 p-2 rounded-md">Error updating status: {toggleError}</p>
          )}
          <button
            onClick={handleToggleCompletion}
            disabled={loadingCompletionToggle}
            className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${isCompleted
                            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}
                        ${loadingCompletionToggle ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loadingCompletionToggle
              ? 'Updating...'
              : isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
          </button>
          {isCompleted && <p className="text-sm text-green-700 mt-2 text-center">🎉 Well done! Content marked as complete.</p>}
        </div>
      </article>

      <div className="mt-12 text-center">
        <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
        >
            Back to Course Modules
        </button>
      </div>
    </div>
  );
};

export default UserContentViewPage;
