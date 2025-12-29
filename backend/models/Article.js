const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  original_description: {
    type: String,
    default: null
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);
