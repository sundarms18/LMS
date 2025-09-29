import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import Course from '../models/Course.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Mark lesson as complete
router.post('/:enrollmentId/lessons/:lessonId/complete', async (req, res) => {
  try {
    const { enrollmentId, lessonId } = req.params;
    
    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      user: req.user._id,
      status: 'active'
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Active enrollment not found' });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if lesson is already completed
    const existingCompletion = enrollment.completedLessons.find(
      cl => cl.lesson.toString() === lessonId
    );

    if (existingCompletion) {
      return res.status(400).json({ message: 'Lesson already completed' });
    }

    // Add lesson to completed lessons
    enrollment.completedLessons.push({
      lesson: lessonId,
      completedAt: new Date()
    });

    // Calculate progress
    const course = await Course.findById(enrollment.course)
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons'
        }
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Check if course is completed
    if (enrollment.progress === 100) {
      enrollment.status = 'completed';
    }

    await enrollment.save();

    // Populate the enrollment for response
    await enrollment.populate('course', 'title');
    await enrollment.populate('user', 'name email');

    res.json({
      message: 'Lesson marked as complete',
      progress: enrollment.progress,
      status: enrollment.status,
      enrollment
    });
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;