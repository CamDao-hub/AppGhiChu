const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { upload } = require('../middlewares/uploadMiddleware');

router.get('/', noteController.getHome); 

router.post('/', upload, noteController.createNote);
router.get('/edit/:id', noteController.getEdit);
router.post('/update/:id', upload, noteController.updateNote);
router.post('/delete/:id', noteController.deleteNote);

// Các route cho thùng rác
router.get('/trash', noteController.getTrash);
router.post('/restore/:id', noteController.restoreNote);
router.post('/delete-forever/:id', noteController.deleteForever);

module.exports = router;