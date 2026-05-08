const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên là bắt buộc'],
      trim: true,
      index: true,
    },
    // Dùng để đăng nhập hoặc hiển thị profile ngắn
    username: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Email không hợp lệ',
      },
    },
    password: {
      type: String,
      required: [true, 'Password là bắt buộc'],
      minlength: [6, 'Password phải có ít nhất 6 ký tự'],
    },
    sessions: {
      type: [String],
      default: [],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    languages: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '/images/default-avatar.png',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    collection: 'users',
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

userSchema.index({ sessions: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;