import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// apiClient is not directly used here anymore, but axiosInstance is used in authApi.js
// import apiClient from '../api/axios';
import { loginUser } from '../api/authApi'; // Import loginUser

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Should store { _id, name, email, role, isApproved }
  const [token, setToken] = useState(localStorage.getItem('token')); // Initialize from localStorage
  const [authLoading, setAuthLoading] = useState(true); // Renamed from 'loading'
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure all necessary fields are present, especially isApproved
        if (parsedUser && parsedUser.email && parsedUser.role !== undefined && parsedUser.isApproved !== undefined) {
          setUser(parsedUser);
        } else {
          // Invalid user object, clear storage
          console.warn("Stored user object is invalid or missing fields. Clearing auth state.");
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } else if (token && !storedUser) {
        // If token exists but no user, means inconsistent state, clear token
        console.warn("Token found but no user data. Clearing token.");
        localStorage.removeItem('token');
        setToken(null);
    }
    setAuthLoading(false);
  }, [token]); // Depend on token so if it's set externally/cleared, this effect re-evaluates

  const login = async (email, password) => {
    try {
      const { token: receivedToken, user: receivedUser } = await loginUser({ email, password });

      if (!receivedUser.isApproved) {
        return { success: false, message: 'Account not approved. Please contact an administrator.' };
      }

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser)); // Ensure receivedUser has all needed fields
      setToken(receivedToken);
      setUser(receivedUser); // This user object should include role and isApproved

      if (receivedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      return { success: true, user: receivedUser };
    } catch (error) {
      console.error('Login failed in AuthContext:', error);
      // error.message should come from authApi.js which gets it from backend or sets a default
      return { success: false, message: error.message || 'Login failed due to an unknown error.' };
    }
  };

  // Register function is removed from context, handled by RegisterPage directly.

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login'); // Redirect to login after logout
  };

  const isAuthenticated = !!token && !!user; // Derived state

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading: authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
