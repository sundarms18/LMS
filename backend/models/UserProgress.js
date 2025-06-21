const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index to ensure a user has only one progress record per content item
userProgressSchema.index({ userId: 1, contentId: 1 }, { unique: true });

// Pre-save hook to update the 'lastAccessed' field
userProgressSchema.pre('save', function(next) {
  this.lastAccessed = Date.now();
  next();
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
