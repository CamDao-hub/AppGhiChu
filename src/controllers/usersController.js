const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../models/users');
const { createUserSchema, loginSchema } = require('../helpers/joi_helper');

// [GET] List user
async function list(req, res) {
    res.send("List users");
}

// [GET] Detail user
async function detail(req, res, next) {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.send("ID không hợp lệ");
        }

        const user = await User.findById(id);

        if (!user) {
            return res.send("User không tồn tại");
        }

        return res.render('sites/profile', { user });

    } catch (err) {
        next(err);
    }
}

// [POST] Create user
async function create(req, res) {
    res.send("Create user");
}

// [PUT] Update user
async function update(req, res) {
    res.send("Update user");
}

// [DELETE] Remove user
async function remove(req, res) {
    res.send("Remove user");
}

// [GET] Register page
async function showRegister(req, res) {
    return res.render("sites/register", { errors: null, oldData: {} });
}

// [POST] Register
async function register(req, res) {
    try {
        const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const joiErrors = {};
            error.details.forEach(d => joiErrors[d.path[0]] = d.message);

            return res.render("sites/register", {
                errors: joiErrors,
                oldData: req.body
            });
        }

        const existingEmail = await User.findOne({ email: value.email });
        if (existingEmail) {
            return res.render("sites/register", {
                errors: { email: "Email đã tồn tại" },
                oldData: req.body
            });
        }

        const hashedPassword = await bcrypt.hash(value.password, 10);

        await User.create({
            name: value.name,
            username: value.name,
            email: value.email,
            password: hashedPassword,
            sessions: [] // Đảm bảo khởi tạo mảng rỗng
        });

        return res.redirect('/users/login?success=true');

    } catch (err) {
        console.error(err);
        return res.render("sites/register", {
            errors: { general: "Lỗi hệ thống" },
            oldData: req.body
        });
    }
}

// [GET] Login page
function showLogin(req, res) {
    const success = req.query.success === 'true' ? 'Đăng ký thành công!' : null;
    return res.render('sites/login', { error: null, success, oldData: {} });
}

// [POST] Login
async function login(req, res) {
    try {
        const { error, value } = loginSchema.validate(req.body);

        if (error) {
            return res.render('sites/login', {
                error: error.details[0].message,
                success: null,
                oldData: req.body
            });
        }

        const user = await User.findOne({ email: value.email });

        if (!user || !(await bcrypt.compare(value.password, user.password))) {
            return res.render('sites/login', {
                error: 'Sai thông tin đăng nhập',
                success: null,
                oldData: req.body
            });
        }

        // Session logic của bạn
        const sessionId = crypto.randomBytes(16).toString('hex');

        await User.updateOne(
            { _id: user._id },
            { $push: { sessions: sessionId } }
        );

        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            signed: true // Cookie có chữ ký
        });

        return res.redirect('/');

    } catch (err) {
        console.error('🔥 Lỗi login:', err);
        return res.render('sites/login', {
            error: 'Lỗi hệ thống',
            success: null,
            oldData: req.body
        });
    }
}

// [GET] Logout
async function logout(req, res, next) {
    try {
        // SỬA: Lấy từ signedCookies cho đồng bộ
        const sessionId = req.signedCookies.sessionId;

        if (sessionId) {
            await User.updateOne(
                { sessions: sessionId },
                { $pull: { sessions: sessionId } }
            );

            res.clearCookie('sessionId');
        }

        return res.redirect('/users/login');

    } catch (err) {
        next(err);
    }
}

module.exports = {
    list,
    detail,
    create,
    update,
    remove,
    showRegister,
    register,
    showLogin,
    login,
    logout,
};