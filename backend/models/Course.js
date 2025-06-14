const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  modules: [{
    type: Schema.Types.ObjectId,
    ref: 'Module',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
