const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const UserProgress = require('../models/UserProgress');

// Apply protect and isAdmin middleware to all routes in this file
router.use(protect, isAdmin);

// @desc    Get a specific user's progress for a specific course
// @route   GET /api/admin/progress/user/:userId/course/:courseId
// @access  Private (Admin only)
router.get('/user/:userId/course/:courseId', async (req, res) => {
  const { userId, courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'Invalid User ID or Course ID format.' });
  }

  try {
    const progress = await UserProgress.find({ userId, courseId })
      .populate('contentId', 'title type') // Populate content title and type
      .sort({ lastAccessed: -1 });

    if (!progress || progress.length === 0) {
      return res.status(404).json({ message: 'No progress found for this user in this course.' });
    }
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error fetching user progress for course (admin):', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @desc    Get all user progress for a specific course
// @route   GET /api/admin/progress/course/:courseId
// @access  Private (Admin only)
router.get('/course/:courseId', async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'Invalid Course ID format.' });
  }

  try {
    const progress = await UserProgress.find({ courseId })
      .populate('userId', 'name email') // Populate user's name and email
      .populate('contentId', 'title type') // Populate content title and type
      .sort({ userId: 1, lastAccessed: -1 }); // Sort by user, then by last access

    if (!progress || progress.length === 0) {
      return res.status(404).json({ message: 'No progress found for this course.' });
    }
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error fetching all progress for course (admin):', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
