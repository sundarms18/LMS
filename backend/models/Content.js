const mongoose = require('mongoose');
const { Schema } = mongoose;

const contentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'text'],
    required: true,
  },
  url: { // For video type
    type: String,
  },
  text_content: { // For text type
    type: String,
  },
  course: { // Reference to the parent course
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
