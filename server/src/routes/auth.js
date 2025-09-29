import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../validators/auth.js';

const router = express.Router();

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
  
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE
  });
  
  return { accessToken, refreshToken };
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ message: 'Account rejected' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    req.user.refreshToken = undefined;
    await req.user.save();
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;