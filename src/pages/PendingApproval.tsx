import React from 'react';
import { Clock, Mail, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const PendingApproval: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Clock className="mx-auto h-24 w-24 text-yellow-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Account Pending Approval
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Your account has been created successfully and is currently pending admin approval.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Mail className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">We'll notify you once approved</span>
          </div>
          <p className="text-sm text-gray-500">
            This process typically takes 24-48 hours. Once your account is approved, 
            you'll be able to log in and start learning.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            In the meantime, you can explore our course catalog
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <span>Browse Courses</span>
          </Link>
          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;