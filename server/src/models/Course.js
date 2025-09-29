import mongoose from 'mongoose';
import slugify from 'slugify';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  enrollmentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug from title
courseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Course', courseSchema);