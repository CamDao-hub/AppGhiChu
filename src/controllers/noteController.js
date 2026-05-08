const Note = require('../models/Note');

// 1. [GET] TRANG CHỦ (Lọc bỏ ghi chú đã xóa)
async function getHome(req, res) {
    try {
        if (!req.user) return res.redirect('/users/login');

        const notes = await Note.find({ 
            userId: req.user._id, 
            isDeleted: { $ne: true } 
        }).sort({ updatedAt: -1 });

        res.render('sites/home', { notes, page: 'home', keyword: "" });
    } catch (error) {
        res.redirect('/users/login');
    }
}

// 2. [POST] DELETE (Xóa tạm)
async function deleteNote(req, res) {
    try {
        if (!req.user) return res.redirect('/users/login');

        await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id }, 
            { isDeleted: true }
        );
        
        res.redirect('/notes'); 
    } catch (error) {
        res.status(500).send('Xóa tạm thất bại');
    }
}

// 3. [POST] RESTORE (Hoàn tác)
async function restoreNote(req, res) {
    try {
        if (!req.user) return res.redirect('/users/login');

        await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id }, 
            { isDeleted: false }
        );
        
        res.redirect('/notes/trash');
    } catch (error) {
        res.redirect('/notes/trash');
    }
}

// 4. [POST] DELETE FOREVER (Xóa vĩnh viễn)
async function deleteForever(req, res) {
    try {
        if (!req.user) return res.redirect('/users/login');

        await Note.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        res.redirect('/notes/trash');
    } catch (error) {
        res.redirect('/trash');
    }
}

// 5. [GET] TRASH PAGE
async function getTrash(req, res) {
    try {
        if (!req.user) return res.redirect('/users/login');

        const notes = await Note.find({ 
            userId: req.user._id, 
            isDeleted: true 
        }).sort({ updatedAt: -1 });

        res.render('sites/home', { notes, keyword: "", page: 'trash' });
    } catch (err) {
        res.redirect('/');
    }
}

// --- CÁC HÀM CŨ ---
async function createNote(req, res) {
    try {
        const { title, content, color } = req.body;
        const imageName = req.file ? req.file.filename : null;
        await Note.create({
            title, content, color: color || 'bg-white',
            image: imageName, userId: req.user._id,
            isDeleted: false 
        });
        res.redirect('/');
    } catch (error) { res.status(500).send('Lỗi tạo ghi chú'); }
}

async function getEdit(req, res) {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
        res.render('sites/edit', { note });
    } catch (error) { res.status(500).send('Lỗi server'); }
}

async function updateNote(req, res) {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.image = req.file.filename;
        await Note.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, updateData);
        res.redirect('/');
    } catch (error) { res.status(500).send('Cập nhật thất bại'); }
}

module.exports = {
    getHome, 
    createNote, 
    getEdit, 
    updateNote, 
    deleteNote, 
    getTrash, 
    restoreNote, 
    deleteForever
};