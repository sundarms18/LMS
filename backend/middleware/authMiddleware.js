const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as necessary

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object, excluding password
      // We might not need to fetch the full user here if not all routes need it.
      // For isAdmin and isApprovedUser, they might re-fetch or this can be expanded.
      req.user = decoded; // Contains userId and role from token payload

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const isApprovedUser = async (req, res, next) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: 'Not authorized, user ID missing' });
  }
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isApproved) {
      // Optionally, refresh parts of req.user with latest db info if needed
      // req.dbUser = user; // Or merge into req.user carefully
      next();
    } else {
      res.status(403).json({ message: 'User account not approved' });
    }
  } catch (error) {
    console.error('Error in isApprovedUser middleware:', error);
    res.status(500).json({ message: 'Server error while checking user approval status' });
  }
};

module.exports = { protect, isAdmin, isApprovedUser };
