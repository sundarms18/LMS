const express = require('express');
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/admin/users - Fetches all users
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude passwords
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/admin/users/:userId/approve - Approves a user
router.patch('/:userId/approve', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isApproved = true;
    await user.save();

    // Return updated user (excluding password)
    const { password, ...userData } = user.toObject();
    res.json(userData);

  } catch (error) {
    console.error('Error approving user:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
