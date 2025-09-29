import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'completed'],
    default: 'pending'
  },
  enrolledAt: {
    type: Date
  },
  completedLessons: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  progress: {
    type: Number,
    default: 0, // percentage
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Ensure unique enrollment per user per course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);