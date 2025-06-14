import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 shadow-inner mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Built with React, TailwindCSS, and lots of learning.
        </p>
        {/* Optional: Add links or other info here */}
        {/* <div className="mt-2">
          <a href="/privacy-policy" className="text-xs text-gray-400 hover:text-indigo-300 px-2">Privacy Policy</a>
          <span className="text-gray-500">|</span>
          <a href="/terms-of-service" className="text-xs text-gray-400 hover:text-indigo-300 px-2">Terms of Service</a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
