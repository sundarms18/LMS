const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, isApprovedUser } = require('../middleware/authMiddleware');
const UserProgress = require('../models/UserProgress');
const Content = require('../models/Content'); // To get courseId when creating new progress

// Apply protect and isApprovedUser middleware to all routes in this file
router.use(protect, isApprovedUser);

// @desc    Toggle completion status for a piece of content
// @route   POST /api/progress/content/:contentId/toggle
// @access  Private (User must be logged in and approved)
router.post('/content/:contentId/toggle', async (req, res) => {
  const { contentId } = req.params;
  const userId = req.user.userId;

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return res.status(400).json({ message: 'Invalid content ID format.' });
  }

  try {
    let progress = await UserProgress.findOne({ userId, contentId });

    if (progress) {
      // Record exists, toggle completion status
      progress.completed = !progress.completed;
      // lastAccessed is updated by pre-save hook
      const updatedProgress = await progress.save();
      res.status(200).json(updatedProgress);
    } else {
      // No record exists, create a new one, marked as completed (first interaction implies completion)
      const content = await Content.findById(contentId).select('course');
      if (!content) {
        return res.status(404).json({ message: 'Content not found.' });
      }
      if (!content.course) {
        return res.status(500).json({ message: 'Content is not associated with a course.' });
      }

      progress = new UserProgress({
        userId,
        contentId,
        courseId: content.course,
        completed: true, // Mark as completed on first toggle if it doesn't exist
        // lastAccessed will be set by default and pre-save hook
      });
      const newProgress = await progress.save();
      res.status(201).json(newProgress);
    }
  } catch (error) {
    console.error('Error toggling content progress:', error);
    if (error.code === 11000) { // Duplicate key error
        return res.status(400).json({ message: 'Progress record conflict. Please try again.'})
    }
    res.status(500).json({ message: 'Server error while toggling content progress.' });
  }
});

// @desc    Get user's progress for a specific course
// @route   GET /api/progress/course/:courseId
// @access  Private (User must be logged in and approved)
router.get('/course/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.userId;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID format.' });
  }

  try {
    const courseProgress = await UserProgress.find({ userId, courseId })
      .select('contentId completed lastAccessed'); // Select only relevant fields

    if (!courseProgress) { // find returns [], so check length or handle as needed
      return res.status(200).json([]); // Return empty array if no progress found
    }

    res.status(200).json(courseProgress);

  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ message: 'Server error while fetching course progress.' });
  }
});

module.exports = router;
