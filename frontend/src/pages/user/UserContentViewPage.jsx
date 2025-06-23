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
