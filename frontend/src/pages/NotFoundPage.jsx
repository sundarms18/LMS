import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-3 4a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-6 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
    <h1 className="text-5xl font-extrabold text-gray-800 mb-3">404</h1>
    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Oops! Page Not Found.</h2>
    <p className="text-gray-500 mb-8">
      The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    </p>
    <Link
      to="/"
      className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200 ease-in-out"
    >
      Go Back to Homepage
    </Link>
  </div>
);

export default NotFoundPage;
