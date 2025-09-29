import express from 'express';
import Enrollment from '../models/Enrollment.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get user enrollments with progress
router.get('/:userId/enrollments', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Users can only access their own enrollments unless they're admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const enrollments = await Enrollment.find({ user: userId })
      .populate('course', 'title description thumbnail')
      .populate('completedLessons.lesson', 'title')
      .sort({ createdAt: -1 });

    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;