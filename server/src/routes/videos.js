import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Lesson from '../models/Lesson.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get video embed URL
router.get('/embed/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Check if user is enrolled and approved for this course
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
      status: 'active'
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    // Verify the video belongs to the course
    const lesson = await Lesson.findOne({ youtubeVideoId: videoId })
      .populate({
        path: 'module',
        match: { course: courseId }
      });

    if (!lesson || !lesson.module) {
      return res.status(404).json({ message: 'Video not found in this course' });
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    
    res.json({ embedUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;