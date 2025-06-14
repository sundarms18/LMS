import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // To get user's name

const UserDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6 text-center">
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome, {user?.name || 'User'}!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We're glad to have you here. Ready to expand your knowledge?
        </p>
        <Link
          to="/courses"
          className="inline-block px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Browse Available Courses
        </Link>
        {/* Future enhancements for the dashboard can go here:
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Activity</h2>
          <p className="text-gray-500">Your enrolled courses or recent activity will appear here.</p>
        </div>
        */}
      </div>
    </div>
  );
};

export default UserDashboardPage;
