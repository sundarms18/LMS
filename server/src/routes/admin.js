import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateCourse, validateModule, validateLesson } from '../validators/course.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate, authorize('admin'));

// User Management
router.get('/users', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const users = await User.find(filter)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/users/:id/approve', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'active';
    await user.save();

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/users/:id/reject', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'rejected';
    await user.save();

    res.json({ message: 'User rejected successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Course Management
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name')
      .populate('modules')
      .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/courses', async (req, res) => {
  try {
    const { error } = validateCourse(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const course = new Course({
      ...req.body,
      instructor: req.user._id
    });

    await course.save();
    await course.populate('instructor', 'name');

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/courses/:id', async (req, res) => {
  try {
    const { error } = validateCourse(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('instructor', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete associated modules and lessons
    await Module.deleteMany({ course: req.params.id });
    await Lesson.deleteMany({ course: req.params.id });
    await Enrollment.deleteMany({ course: req.params.id });
    
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Module Management
router.post('/courses/:courseId/modules', async (req, res) => {
  try {
    const { error } = validateModule(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = new Module({
      ...req.body,
      course: req.params.courseId
    });

    await module.save();
    
    course.modules.push(module._id);
    await course.save();

    res.status(201).json({ message: 'Module created successfully', module });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/modules/:id', async (req, res) => {
  try {
    const { error } = validateModule(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const module = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    res.json({ message: 'Module updated successfully', module });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/modules/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Delete associated lessons
    await Lesson.deleteMany({ module: req.params.id });
    
    // Remove from course
    await Course.findByIdAndUpdate(
      module.course,
      { $pull: { modules: req.params.id } }
    );
    
    await Module.findByIdAndDelete(req.params.id);

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Lesson Management
router.post('/modules/:moduleId/lessons', async (req, res) => {
  try {
    const { error } = validateLesson(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const lesson = new Lesson({
      ...req.body,
      module: req.params.moduleId
    });

    await lesson.save();
    
    module.lessons.push(lesson._id);
    await module.save();

    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/lessons/:id', async (req, res) => {
  try {
    const { error } = validateLesson(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Remove from module
    await Module.findByIdAndUpdate(
      lesson.module,
      { $pull: { lessons: req.params.id } }
    );
    
    await Lesson.findByIdAndDelete(req.params.id);

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enrollment Management
router.get('/enrollments', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const enrollments = await Enrollment.find(filter)
      .populate('user', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/enrollments/:id/approve', async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.status = 'active';
    enrollment.enrolledAt = new Date();
    await enrollment.save();

    res.json({ message: 'Enrollment approved successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/enrollments/:id/reject', async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.status = 'rejected';
    await enrollment.save();

    res.json({ message: 'Enrollment rejected successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Progress Tracking
router.get('/progress/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollments = await Enrollment.find({
      course: req.params.courseId,
      status: 'active'
    })
    .populate('user', 'name email')
    .populate('completedLessons.lesson', 'title')
    .populate({
      path: 'course',
      populate: {
        path: 'modules',
        populate: {
          path: 'lessons'
        }
      }
    });

    // Calculate detailed progress for each enrollment
    const progressData = enrollments.map(enrollment => {
      const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
      const completedLessons = enrollment.completedLessons.length;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      return {
        ...enrollment.toObject(),
        totalLessons,
        completedLessonsCount: completedLessons,
        progressPercentage
      };
    });

    res.json({ 
      course: {
        title: course.title,
        _id: course._id
      },
      enrollments: progressData 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get overall course statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const pendingEnrollments = await Enrollment.countDocuments({ status: 'pending' });

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        pending: pendingUsers
      },
      courses: {
        total: totalCourses,
        published: publishedCourses
      },
      enrollments: {
        total: totalEnrollments,
        active: activeEnrollments,
        completed: completedEnrollments,
        pending: pendingEnrollments
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;