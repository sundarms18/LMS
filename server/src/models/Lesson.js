import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['video', 'text'],
    required: true
  },
  content: {
    type: String,
    required: function() {
      return this.type === 'text';
    }
  },
  youtubeVideoId: {
    type: String,
    required: function() {
      return this.type === 'video';
    }
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Lesson', lessonSchema);