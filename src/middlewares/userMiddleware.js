const User = require('../models/users');
async function requireAuth(req, res, next) {
    try {
        const sessionId = req.signedCookies.sessionId;
        // 1. Kiểm tra sự tồn tại của Cookie
        if (!sessionId) {
            return res.redirect('/users/login');
        }
        // 2. Kiểm tra Session trong Database
        const user = await User.findOne({ sessions: sessionId });
        if (!user) {
            return res.redirect('/users/login');
        }
        // 3. Gán user vào request để dùng ở các Controller sau
        req.user = user;
        next();
    } catch (err) {
        // Chỉ giữ lại log lỗi hệ thống để debug khi cần thiết
        console.error('Lỗi xác thực hệ thống:', err);
        return res.redirect('/users/login');
    }
}
module.exports = {
    requireAuth
};