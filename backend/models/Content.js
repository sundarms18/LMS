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
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
