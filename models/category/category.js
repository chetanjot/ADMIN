const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensures uniqueness
    index: true   // Speeds up queries
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create a compound index if needed
CategorySchema.index({ name: 1, createdAt: -1 });

module.exports = mongoose.model('Category', CategorySchema);
