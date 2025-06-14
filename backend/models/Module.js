const mongoose = require('mongoose');
const { Schema } = mongoose;

const moduleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  content: [{
    type: Schema.Types.ObjectId,
    ref: 'Content',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
