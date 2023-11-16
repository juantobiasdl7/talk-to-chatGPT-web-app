const express = require('express');
const multer = require('multer');
const chatController = require('../controllers/chatControllers');
const router = express.Router();

// Configure multer
const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

router.post('/process-audio', upload.single('audio'), chatController.processAudio);

module.exports = router;
