import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();

  const activeClassName = "text-indigo-300";
  const inactiveClassName = "hover:text-indigo-300";

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              LMS Platform
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName + " px-3 py-2 rounded-md text-sm font-medium transition-colors"}
              >
                Home
              </NavLink>

              {authLoading ? (
                <span className="px-3 py-2 rounded-md text-sm font-medium">Loading...</span>
              ) : isAuthenticated && user ? (
                <>
                  <NavLink
                    to={user.role === 'admin' ? "/admin/dashboard" : "/dashboard"}
                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName + " px-3 py-2 rounded-md text-sm font-medium transition-colors"}
                  >
                    Dashboard
                  </NavLink>
                  {user.role !== 'admin' && (
                    <>
                      <NavLink
                        to="/my-courses"
                        className={({ isActive }) => isActive ? activeClassName : inactiveClassName + " px-3 py-2 rounded-md text-sm font-medium transition-colors"}
                      >
                        My Courses
                      </NavLink>
                      <NavLink
                        to="/courses"
                        className={({ isActive }) => isActive ? activeClassName : inactiveClassName + " px-3 py-2 rounded-md text-sm font-medium transition-colors"}
                      >
                        Browse All Courses
                      </NavLink>
                      <NavLink
                        to="/my-enrollments"
                        className={({ isActive }) => isActive ? activeClassName : inactiveClassName + " px-3 py-2 rounded-md text-sm font-medium transition-colors"}
                      >
                        My Enrollments
                      </NavLink>
                    </>
                  )}
                  {/* Consider an Admin dropdown for more links if needed */}
                  {/* {user.role === 'admin' && (
                    <NavLink
                      to="/admin/users" // Example specific admin link
                      className={({ isActive }) => isActive ? activeClassName : inactiveClassName + " px-3 py-2 rounded-md text-sm font-medium transition-colors"}
                    >
                      User Management
                    </NavLink>
                  )} */}
                </>
              ) : (
                <>
                  {/* Links for guests are on the right side */}
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {authLoading ? null : isAuthenticated && user ? (
                <>
                  <span className="text-gray-300 text-sm mr-3">
                    Welcome, <span className="font-semibold">{user.name}</span> ({user.role})
                  </span>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <NavLink
                    to="/login"
                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName + " px-3 py-2 rounded-md text-sm font-medium transition-colors"}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName + " bg-indigo-500 hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"}
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>
          {/* Mobile menu button can be added here if needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
