const express = require('express');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Content = require('../models/Content');
const { protect, isApprovedUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protect and isApprovedUser middleware to all routes in this file
router.use(protect, isApprovedUser);

// GET /api/courses - Fetches all published courses (summary)
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({}) // Assuming all courses are "published" for now
      .populate('instructor', 'name') // Populate only instructor's name
      .select('title description instructor modules'); // Select specific fields

    // Optionally, add a module count or a brief summary of modules if needed
    const coursesWithModuleCount = courses.map(course => {
        return {
            _id: course._id,
            title: course.title,
            description: course.description,
            instructor: course.instructor,
            moduleCount: course.modules ? course.modules.length : 0,
        };
    });

    res.json(coursesWithModuleCount);
  } catch (error) {
    console.error('Error fetching courses for user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/courses/:courseId - Fetches a single course with module and content overview
router.get('/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('instructor', 'name') // Populate instructor's name
      .populate({
        path: 'modules',
        select: 'title description content', // Select fields for modules
        populate: {
          path: 'content',
          model: 'Content',
          select: '_id title type', // Select specific fields for content overview
        },
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching single course for user:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid course ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/content/:contentId - Fetches a specific piece of content
router.get('/content/:contentId', async (req, res) => {
  try {
    const content = await Content.findById(req.params.contentId);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // TODO: Future enhancement: Check if the content belongs to a course the user is enrolled in.
    // For now, any approved user can access content if they have the ID.

    res.json(content); // Returns all details: title, type, url, text_content
  } catch (error) {
    console.error('Error fetching content for user:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid content ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
