import express from 'express';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all published courses (public)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructor', 'name')
      .select('-modules')
      .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by slug with modules and lessons
router.get('/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isPublished: true })
      .populate('instructor', 'name')
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons',
          select: 'title description type duration order'
        },
        options: { sort: { order: 1 } }
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in course
router.post('/:courseId/enroll', authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      user: req.user._id,
      course: courseId
    });

    await enrollment.save();

    res.status(201).json({
      message: 'Enrollment request submitted. Please wait for admin approval.',
      enrollment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;