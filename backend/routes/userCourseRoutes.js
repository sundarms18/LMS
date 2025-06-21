const express = require('express');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Content = require('../models/Content');
const Enrollment = require('../models/Enrollment'); // Import Enrollment model
const { protect, isApprovedUser } = require('../middleware/authMiddleware');
const { checkCourseEnrollment } = require('../middleware/enrollmentMiddleware'); // Import enrollment check

const router = express.Router();

// Apply protect and isApprovedUser middleware to all routes in this file
// Note: The base path for these routes is /api/courses as defined in server.js
router.use(protect, isApprovedUser);

// GET /api/courses/my-enrolled-courses - Fetches all courses a user is enrolled in
router.get('/my-enrolled-courses', async (req, res) => {
  try {
    const userId = req.user.userId;
    const enrollments = await Enrollment.find({ userId, status: 'approved' })
      .select('courseId'); // We only need courseId to fetch full course details

    if (!enrollments || enrollments.length === 0) {
      return res.json([]); // Return empty array if no approved enrollments
    }

    const courseIds = enrollments.map(enrollment => enrollment.courseId);

    // Fetch full course details for each enrolled courseId
    const enrolledCourses = await Promise.all(
      courseIds.map(async (courseId) => {
        return Course.findById(courseId)
          .populate('instructor', 'name')
          .populate({
            path: 'modules',
            select: 'title description content',
            populate: {
              path: 'content',
              model: 'Content',
              select: '_id title type',
            },
          });
      })
    );

    // Filter out any null results if a course was deleted after enrollment
    res.json(enrolledCourses.filter(course => course !== null));

  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Server error while fetching enrolled courses.' });
  }
});


// GET /api/courses/courses - Fetches all published courses (summary)
// Renamed from '/courses' to '/courses/courses' to avoid conflict if this file is mounted at /api/courses
// However, server.js mounts this at /api/courses, so the route should be /
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

// GET /api/courses/courses/:courseId - Fetches a single course with module and content overview
// Applied protect, isApprovedUser (from router.use) and checkCourseEnrollment
router.get('/courses/:courseId', checkCourseEnrollment, async (req, res) => {
  try {
    // The courseId is validated by checkCourseEnrollment if it's a valid ObjectId
    // and the user is enrolled.
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

// GET /api/courses/content/:contentId - Fetches a specific piece of content
// Applied protect, isApprovedUser (from router.use) and checkCourseEnrollment
router.get('/content/:contentId', checkCourseEnrollment, async (req, res) => {
  try {
    // The contentId is validated by checkCourseEnrollment, and it also determines courseId
    // and checks enrollment for that course.
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
