const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const { requireAuth } = require('../middlewares/userMiddleware');

// Trang chủ
router.get('/', requireAuth, siteController.getHome);

module.exports = router;