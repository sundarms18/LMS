import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }]
}, {
  timestamps: true
});

export default mongoose.model('Module', moduleSchema);