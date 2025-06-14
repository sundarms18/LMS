const express = require('express');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Content = require('../models/Content');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/admin/courses/:courseId/modules - Adds a new module to a course
// Path relative to where router is mounted. If mounted at /api/admin, this becomes /api/admin/courses/:courseId/modules
router.post('/courses/:courseId/modules', protect, isAdmin, async (req, res) => {
  const { title, description } = req.body;
  const { courseId } = req.params;

  if (!title) {
    return res.status(400).json({ message: 'Module title is required' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = new Module({
      title,
      description,
    });
    const createdModule = await module.save();

    course.modules.push(createdModule._id);
    await course.save();

    res.status(201).json(createdModule);
  } catch (error) {
    console.error('Error creating module:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid course ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/modules/:moduleId - Updates a module's details
// Path relative to where router is mounted. If mounted at /api/admin, this becomes /api/admin/modules/:moduleId
router.put('/modules/:moduleId', protect, isAdmin, async (req, res) => {
  const { title, description } = req.body;
  const { moduleId } = req.params;

  try {
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    module.title = title || module.title;
    module.description = description || module.description;

    const updatedModule = await module.save();
    res.json(updatedModule);
  } catch (error) {
    console.error('Error updating module:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid module ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/modules/:moduleId - Deletes a module
// Path relative to where router is mounted. If mounted at /api/admin, this becomes /api/admin/modules/:moduleId
router.delete('/modules/:moduleId', protect, isAdmin, async (req, res) => {
  const { moduleId } = req.params;
  try {
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    if (module.content && module.content.length > 0) {
      await Content.deleteMany({ _id: { $in: module.content } });
    }

    await Course.updateMany(
      { modules: moduleId },
      { $pull: { modules: moduleId } }
    );

    await module.deleteOne();

    res.json({ message: 'Module and associated content deleted, and reference removed from course(s)' });
  } catch (error) {
    console.error('Error deleting module:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid module ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
