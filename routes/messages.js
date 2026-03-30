var express = require('express');
var router = express.Router();
const messageController = require('../controllers/message');

/**
 * CHỨC NĂNG 3: Lấy tin nhắn cuối cùng của mỗi cuộc hội thoại (Inbox)
 * URL: GET http://localhost:3000/api/v1/messages/inbox/:userId
 * Lưu ý: Phải để route này lên ĐẦU TIÊN để tránh bị nhầm với route lấy ID bên dưới.
 */
router.get('/inbox/:userId', async function(req, res) {
    try {
        const data = await messageController.GetInboxList(req.params.userId);
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * CHỨC NĂNG 1: Lấy toàn bộ lịch sử chat giữa 2 người
 * URL: GET http://localhost:3000/api/v1/messages/:from/:to
 */
router.get('/:from/:to', async function(req, res) {
    try {
        const { from, to } = req.params;
        const data = await messageController.GetMessagesWithUser(from, to);
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * CHỨC NĂNG 2: Gửi tin nhắn mới (Text hoặc File path)
 * URL: POST http://localhost:3000/api/v1/messages
 * Body JSON: { "from": "...", "to": "...", "text": "...", "type": "text/file" }
 */
router.post('/', async function(req, res) {
    try {
        const { from, to, text, type } = req.body;
        const data = await messageController.CreateMessage(from, to, text, type || 'text');
        res.status(201).json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;