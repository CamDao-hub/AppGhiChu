const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db.js');

// ROUTERS
const siteRoutes = require('./routers/siteRouter.js');
const noteRoutes = require('./routers/noteRouter.js');
const editRoutes = require('./routers/editRouter.js');
const usersRoutes = require('./routers/usersRouter.js');

const User = require('./models/users'); //

const app = express();
const session = require('express-session');

// ===== SESSION ===== (giữ nguyên, không phá)
app.use(session({
  secret: process.env.COOKIES_KEY,
  resave: false,
  saveUninitialized: true,
}));

// ===== Connect DB =====
connectDB();

// ===== Logger =====
app.use(morgan('dev'));

// ===== Static =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== Cookie parser (SIGNED) =====
app.use(cookieParser(process.env.COOKIES_KEY)); 

// ===== View engine =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 
app.use(async (req, res, next) => {
  try {
    // 👉 dùng signedCookies
    const sessionId = req.signedCookies.sessionId;

    if (sessionId) {
      const user = await User.findOne({
        sessions: sessionId
      });

      if (user) {
        req.user = user;
        res.locals.user = user; // dùng trong EJS
      } else {
        res.locals.user = null;
      }
    } else {
      res.locals.user = null;
    }

    next();
  } catch (err) {
    console.error('Auth middleware lỗi:', err);
    next();
  }
});

// ===== Routes =====

// Trang chủ + search
app.use('/', siteRoutes);

// Login
app.use('/users', usersRoutes);

// CRUD note
app.use('/notes', noteRoutes);

// Edit
app.use('/notes', editRoutes);

module.exports = app;