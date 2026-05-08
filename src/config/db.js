const mongoose = require('mongoose');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/note-app';

// Kết nối MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Kết nối MongoDB thành công!');
    console.log(`Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error.message);
  }
}

// Event: connected
mongoose.connection.on('connected', () => {
  console.log('Mongoose đã kết nối tới MongoDB');
});

// Event: error
mongoose.connection.on('error', (err) => {
  console.error('Mongoose lỗi kết nối:', err.message);
});

// Event: disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose đã ngắt kết nối');
});

module.exports = connectDB;