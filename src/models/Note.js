const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'bg-white'
  },
  image: {
    type: String, 
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Note', noteSchema);