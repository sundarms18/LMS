const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const Content = require('../models/Content'); // Needed to find courseId from contentId

const checkCourseEnrollment = async (req, res, next) => {
  const userId = req.user.userId; // Assumes protect middleware has run and set req.user
  let courseIdToQuery;

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized, no user ID found.' });
  }

  // Determine courseId
  if (req.params.courseId) {
    courseIdToQuery = req.params.courseId;
  } else if (req.params.contentId) {
    if (!mongoose.Types.ObjectId.isValid(req.params.contentId)) {
        return res.status(400).json({ message: 'Invalid content ID format for enrollment check.' });
    }
    try {
      const content = await Content.findById(req.params.contentId).select('course');
      if (!content) {
        return res.status(404).json({ message: 'Content not found, cannot verify enrollment.' });
      }
      if (!content.course) {
        return res.status(500).json({ message: 'Content is not associated with a course, cannot verify enrollment.' });
      }
      courseIdToQuery = content.course.toString();
    } catch (error) {
      console.error('Error fetching content for enrollment check:', error);
      return res.status(500).json({ message: 'Server error during enrollment check (content fetch).' });
    }
  }

  if (!courseIdToQuery) {
    return res.status(400).json({ message: 'Could not determine course for enrollment check.' });
  }

  if (!mongoose.Types.ObjectId.isValid(courseIdToQuery)) {
    return res.status(400).json({ message: 'Invalid course ID format for enrollment check.' });
  }

  try {
    const enrollment = await Enrollment.findOne({
      userId: userId,
      courseId: courseIdToQuery,
      status: 'approved',
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Access denied. You are not enrolled in this course or your enrollment is not approved.' });
    }

    // User is enrolled and approved
    next();
  } catch (error) {
    console.error('Error verifying course enrollment:', error);
    res.status(500).json({ message: 'Server error during enrollment verification.' });
  }
};

module.exports = { checkCourseEnrollment };
