const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/edit/:id', noteController.getEdit);
router.post('/update/:id', noteController.updateNote);

module.exports = router;