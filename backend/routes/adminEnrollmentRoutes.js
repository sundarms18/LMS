const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // For ObjectId validation
const { protect, isAdmin } = require('../middleware/authMiddleware');
const Enrollment = require('../models/Enrollment');
// User and Course models might not be strictly needed if only populating,
// but good to have if we needed to validate their existence beyond what mongoose populate does.
// const User = require('../models/User');
// const Course = require('../models/Course');

// @desc    Get all pending enrollments
// @route   GET /api/admin/enrollments/pending
// @access  Private (Admin only)
router.get('/pending', protect, isAdmin, async (req, res) => {
  try {
    const pendingEnrollments = await Enrollment.find({ status: 'pending' })
      .populate('userId', 'name email') // Populate user's name and email
      .populate('courseId', 'title') // Populate course title
      .sort({ requestedAt: 'asc' }); // Oldest requests first

    res.status(200).json(pendingEnrollments);
  } catch (error) {
    console.error('Error fetching pending enrollments:', error);
    res.status(500).json({ message: 'Server error fetching pending enrollments.' });
  }
});

// @desc    Approve an enrollment request
// @route   PATCH /api/admin/enrollments/:enrollmentId/approve
// @access  Private (Admin only)
router.patch('/:enrollmentId/approve', protect, isAdmin, async (req, res) => {
  const { enrollmentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
    return res.status(400).json({ message: 'Invalid enrollment ID format.' });
  }

  try {
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found.' });
    }

    if (enrollment.status !== 'pending') {
      return res.status(400).json({ message: `Enrollment is already ${enrollment.status}.` });
    }

    enrollment.status = 'approved';
    // enrollment.updatedAt is handled by pre-save hook
    const updatedEnrollment = await enrollment.save();

    // TODO: Potentially, here you could trigger a notification to the user.
    res.status(200).json(updatedEnrollment);

  } catch (error) {
    console.error('Error approving enrollment:', error);
    res.status(500).json({ message: 'Server error while approving enrollment.' });
  }
});

// @desc    Reject an enrollment request
// @route   PATCH /api/admin/enrollments/:enrollmentId/reject
// @access  Private (Admin only)
router.patch('/:enrollmentId/reject', protect, isAdmin, async (req, res) => {
  const { enrollmentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
    return res.status(400).json({ message: 'Invalid enrollment ID format.' });
  }

  try {
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found.' });
    }

    if (enrollment.status !== 'pending') {
      return res.status(400).json({ message: `Enrollment is already ${enrollment.status}.` });
    }

    enrollment.status = 'rejected';
    // enrollment.updatedAt is handled by pre-save hook
    const updatedEnrollment = await enrollment.save();

    // TODO: Potentially, here you could trigger a notification to the user.
    res.status(200).json(updatedEnrollment);

  } catch (error) {
    console.error('Error rejecting enrollment:', error);
    res.status(500).json({ message: 'Server error while rejecting enrollment.' });
  }
});

// @desc    Get all enrollments for a specific course
// @route   GET /api/admin/enrollments/course/:courseId
// @access  Private (Admin only)
router.get('/course/:courseId', protect, isAdmin, async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID format.' });
  }

  try {
    const enrollments = await Enrollment.find({ courseId })
      .populate('userId', 'name email')
      .sort({ status: 1, requestedAt: -1 }); // Sort by status, then by date

    res.status(200).json(enrollments);
  } catch (error) {
    console.error(`Error fetching enrollments for course ${courseId}:`, error);
    res.status(500).json({ message: 'Server error fetching course enrollments.' });
  }
});

// @desc    Get all enrollments for a specific user
// @route   GET /api/admin/enrollments/user/:userId
// @access  Private (Admin only)
router.get('/user/:userId', protect, isAdmin, async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format.' });
  }

  try {
    const enrollments = await Enrollment.find({ userId })
      .populate('courseId', 'title')
      .sort({ status: 1, requestedAt: -1 });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error(`Error fetching enrollments for user ${userId}:`, error);
    res.status(500).json({ message: 'Server error fetching user enrollments.' });
  }
});

// @desc    Get all enrollments (regardless of status)
// @route   GET /api/admin/enrollments
// @access  Private (Admin only)
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const allEnrollments = await Enrollment.find({})
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .sort({ updatedAt: 'desc' }); // Sort by most recently updated

    res.status(200).json(allEnrollments);
  } catch (error) {
    console.error('Error fetching all enrollments:', error);
    res.status(500).json({ message: 'Server error fetching all enrollments.' });
  }
});

module.exports = router;
