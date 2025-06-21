const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // For ObjectId validation
const { protect, isApprovedUser } = require('../middleware/authMiddleware');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course'); // To check if course exists

// @desc    Request enrollment in a course
// @route   POST /api/enroll/request/:courseId
// @access  Private (User must be logged in and approved)
router.post('/request/:courseId', protect, isApprovedUser, async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.userId; // From protect middleware

  // Validate courseId
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID format' });
  }

  try {
    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if course is published (optional, depends on business logic)
    // if (!course.isPublished) {
    //   return res.status(400).json({ message: 'Course is not available for enrollment' });
    // }

    // Check if an enrollment already exists for this user and course
    // Considering status: if a user was 'rejected', should they be able to request again?
    // Current check: Prevents new request if any existing non-rejected enrollment exists.
    const existingEnrollment = await Enrollment.findOne({
      userId,
      courseId,
      status: { $ne: 'rejected' } // Allow re-request if previous was rejected
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === 'pending') {
        return res.status(400).json({ message: 'Enrollment request already pending.' });
      } else if (existingEnrollment.status === 'approved') {
        return res.status(400).json({ message: 'You are already enrolled in this course.' });
      }
      // If status is 'rejected', they are allowed to create a new one.
    }

    // Create new enrollment request
    const enrollment = new Enrollment({
      userId,
      courseId,
      status: 'pending', // Default, but explicit for clarity
    });

    const createdEnrollment = await enrollment.save();
    res.status(201).json(createdEnrollment);

  } catch (error) {
    console.error('Error requesting enrollment:', error);
    // Check for duplicate key error (if user somehow bypasses the check above for rejected and tries to create another pending)
    if (error.code === 11000) {
        return res.status(400).json({ message: 'An enrollment request for this course already exists.' });
    }
    res.status(500).json({ message: 'Server error while processing enrollment request.' });
  }
});

// @desc    Get user's enrollment statuses
// @route   GET /api/enroll/my-status
// @access  Private (User must be logged in and approved)
router.get('/my-status', protect, isApprovedUser, async (req, res) => {
  const userId = req.user.userId;

  try {
    const enrollments = await Enrollment.find({ userId })
      .populate('courseId', 'title description instructor') // Populate course details
      .sort({ requestedAt: -1 }); // Sort by most recent requests

    if (!enrollments) {
      return res.status(404).json({ message: 'No enrollments found for this user.' });
    }

    res.status(200).json(enrollments);

  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    res.status(500).json({ message: 'Server error while fetching enrollment statuses.' });
  }
});

module.exports = router;
