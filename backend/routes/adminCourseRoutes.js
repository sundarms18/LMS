const express = require('express');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Content = require('../models/Content');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/admin/courses - Create a new course
router.post('/', protect, isAdmin, async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  try {
    const course = new Course({
      title,
      description,
      instructor: req.user.userId, // Assuming protect middleware adds userId to req.user
    });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/courses - Fetch all courses
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const courses = await Course.find({}).populate('instructor', 'name email'); // Populate instructor details
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/courses/:courseId - Fetch a single course
router.get('/:courseId', protect, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('instructor', 'name email')
      .populate({
        path: 'modules',
        populate: {
          path: 'content',
          model: 'Content',
          select: 'title type url text_content' // Select specific content fields
        }
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid course ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/courses/:courseId - Update a course
router.put('/:courseId', protect, isAdmin, async (req, res) => {
  const { title, description } = req.body;
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    // Instructor should not be changed here, or handled differently if allowed

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid course ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/courses/:courseId - Delete a course and its associated modules/content
router.delete('/:courseId', protect, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find all modules in the course
    const modules = await Module.find({ _id: { $in: course.modules } });

    for (const module of modules) {
      // Delete all content within each module
      if (module.content && module.content.length > 0) {
        await Content.deleteMany({ _id: { $in: module.content } });
      }
    }

    // Delete all modules in the course
    if (course.modules && course.modules.length > 0) {
      await Module.deleteMany({ _id: { $in: course.modules } });
    }

    // Delete the course itself
    await course.deleteOne(); // Changed from course.remove() to course.deleteOne()

    res.json({ message: 'Course and associated modules and content deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid course ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
