const Note = require('../models/Note');

async function getHome(req, res) {
    try {
        const keyword = req.query.q || "";
        
        if (!req.user) {
            return res.render('sites/home', { 
                notes: [], 
                keyword: "" 
            });
        }

        // 2. KHỞI TẠO QUERY
        let query = { 
            userId: req.user._id,
            isDeleted: { $ne: true } 
        };

        // 3. LOGIC SEARCH
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { content: { $regex: keyword, $options: 'i' } }
            ];
        }

        // 4. TRUY VẤN
        const notes = await Note.find(query).sort({ createdAt: -1 });

        // 5. RENDER
        res.render('sites/home', { 
            notes,
            keyword,
            page: 'home' 
        });

    } catch (error) {
        console.error("🔥 Lỗi tại getHome:", error);
        res.status(500).send('Lỗi hệ thống khi tải trang chủ');
    }
}

module.exports = { 
    getHome 
};