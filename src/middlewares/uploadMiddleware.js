const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util'); // Dùng để biến callback thành promise

const uploadDir = path.resolve(__dirname, '../public/images');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const multerUpload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ cho phép upload file ảnh!'), false);
        }
    }
});

// Chuyển hàm single của multer thành dạng Promise
const uploadSingle = promisify(multerUpload.single('image'));

// 👉 Middleware chuẩn Async/Await
async function upload(req, res, next) {
    try {
        // Đợi upload hoàn tất
        await uploadSingle(req, res);
        
        // Nếu chạy đến đây là upload thành công (có file hoặc không có file đều được)
        // Controller sẽ xử lý việc req.file có tồn tại hay không
        next();
    } catch (err) {
        // Nếu có lỗi (file quá lớn, sai định dạng...), catch sẽ bắt được ngay
        console.error("🔥 Lỗi upload middleware:", err.message);
        
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Lỗi Multer: ${err.message}` });
        }
        
        return res.status(400).json({ message: err.message });
    }
}

module.exports = {
    upload
};