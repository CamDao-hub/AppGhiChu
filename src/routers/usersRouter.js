const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

// ===== AUTH =====
router.get('/register', userController.showRegister);
router.post('/register', userController.register);

router.get('/login', userController.showLogin);
router.post('/login', userController.login);

router.get('/logout', userController.logout);

// ===== PROFILE =====
router.get('/profile/:id', userController.detail);

// ===== CRUD USERS =====

// LẤY DANH SÁCH USER
router.get('/', userController.list);

// TẠO USER
router.post('/', userController.create);

// LẤY USER THEO ID (ĐỔI ROUTE cho an toàn)
router.get('/detail/:id', userController.detail);

// CẬP NHẬT USER
router.put('/detail/:id', userController.update);

// XOÁ USER
router.delete('/detail/:id', userController.remove);

module.exports = router;