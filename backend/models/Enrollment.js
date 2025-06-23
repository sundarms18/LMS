const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Referencing the Course model
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    required: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update the 'updatedAt' field
enrollmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure a user cannot enroll in the same course multiple times with a unique compound index
// (unless previous attempts were 'rejected', for example - this index is strict)
// Consider if a user can re-request after rejection. If so, a more complex validation might be needed
// or this index might be too restrictive if 'rejected' enrollments are kept.
// For now, a user can only have one enrollment record per course.
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });


const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
