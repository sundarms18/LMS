const express = require('express');
const Module = require('../models/Module');
const Content = require('../models/Content');
const Course = require('../models/Course'); // Import Course model
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/admin/modules/:moduleId/content - Adds new content to a module
// Path relative to where router is mounted. If mounted at /api/admin, this becomes /api/admin/modules/:moduleId/content
router.post('/modules/:moduleId/content', protect, isAdmin, async (req, res) => {
  const { title, type, url, text_content } = req.body;
  const { moduleId } = req.params;

  if (!title || !type) {
    return res.status(400).json({ message: 'Content title and type are required' });
  }
  if (type === 'video' && !url) {
    return res.status(400).json({ message: 'URL is required for video content' });
  }
  if (type === 'text' && !text_content) {
    return res.status(400).json({ message: 'Text content is required for text content type' });
  }

  try {
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Find the course this module belongs to
    const course = await Course.findOne({ modules: moduleId });
    if (!course) {
      // This case should ideally not happen if data is consistent
      return res.status(404).json({ message: 'Parent course not found for this module' });
    }

    const content = new Content({
      title,
      type,
      url: type === 'video' ? url : undefined,
      text_content: type === 'text' ? text_content : undefined,
      course: course._id, // Add the course ID
    });
    const createdContent = await content.save();

    module.content.push(createdContent._id);
    await module.save();

    res.status(201).json(createdContent);
  } catch (error) {
    console.error('Error creating content:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid module ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/content/:contentId - Updates content details
// Path relative to where router is mounted. If mounted at /api/admin, this becomes /api/admin/content/:contentId
router.put('/content/:contentId', protect, isAdmin, async (req, res) => {
  const { title, type, url, text_content } = req.body;
  const { contentId } = req.params;

  try {
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    content.title = title || content.title;
    if (type) content.type = type;

    if (type === 'video') {
      content.url = url || content.url;
      content.text_content = undefined;
    } else if (type === 'text') {
      content.text_content = text_content || content.text_content;
      content.url = undefined;
    } else {
        if (url && content.type === 'video') content.url = url;
        if (text_content && content.type === 'text') content.text_content = text_content;
    }

    const updatedContent = await content.save();
    res.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid content ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/content/:contentId - Deletes content
// Path relative to where router is mounted. If mounted at /api/admin, this becomes /api/admin/content/:contentId
router.delete('/content/:contentId', protect, isAdmin, async (req, res) => {
  const { contentId } = req.params;
  try {
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    await Module.updateMany(
      { content: contentId },
      { $pull: { content: contentId } }
    );

    await content.deleteOne();

    res.json({ message: 'Content deleted and reference removed from module(s)' });
  } catch (error) {
    console.error('Error deleting content:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid content ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
