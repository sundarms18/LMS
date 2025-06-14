import React, { useState, useEffect } from 'react';

const AdminContentForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('text'); // Default to 'text'
  const [url, setUrl] = useState(''); // For video type
  const [textContent, setTextContent] = useState(''); // For text type

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setType(initialData.type || 'text');
      if (initialData.type === 'video') {
        setUrl(initialData.url || '');
        setTextContent(''); // Clear text content if type is video
      } else {
        setTextContent(initialData.text_content || '');
        setUrl(''); // Clear URL if type is text
      }
    } else {
      // Reset for new content
      setTitle('');
      setType('text');
      setUrl('');
      setTextContent('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }
    const contentData = { title, type };
    if (type === 'video') {
      if (!url.trim()) {
        alert('Video URL is required for video type.');
        return;
      }
      contentData.url = url;
    } else { // 'text'
      if (!textContent.trim()) {
        alert('Text content is required for text type.');
        return;
      }
      contentData.text_content = textContent;
    }
    onSubmit(contentData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="relative mx-auto p-8 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <h3 className="text-xl font-semibold mb-6 text-center">
          {initialData ? 'Edit Content' : 'Add New Content'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="contentTitle" className="block text-sm font-medium text-gray-700">
              Content Title
            </label>
            <input
              type="text"
              name="contentTitle"
              id="contentTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="contentType" className="block text-sm font-medium text-gray-700">
              Content Type
            </label>
            <select
              id="contentType"
              name="contentType"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                // Clear other type's field when switching
                if (e.target.value === 'video') setTextContent('');
                if (e.target.value === 'text') setUrl('');
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
            </select>
          </div>

          {type === 'video' && (
            <div>
              <label htmlFor="contentUrl" className="block text-sm font-medium text-gray-700">
                Video URL
              </label>
              <input
                type="url"
                name="contentUrl"
                id="contentUrl"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="e.g., https://www.youtube.com/watch?v=..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          )}

          {type === 'text' && (
            <div>
              <label htmlFor="contentTextContent" className="block text-sm font-medium text-gray-700">
                Text Content
              </label>
              <textarea
                name="contentTextContent"
                id="contentTextContent"
                rows="6"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminContentForm;
