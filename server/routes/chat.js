const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const MESSAGES_FILE = path.join(__dirname, '../data/messages.json');

const readMessages = () => {
    try {
        if (!fs.existsSync(MESSAGES_FILE)) return [];
        return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
    } catch (err) { return []; }
};

const writeMessages = (msgs) => {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2));
};

// GET /api/chat/:partnerId
router.get('/:partnerId', (req, res) => {
    const studentId = req.headers['x-student-id'];
    const { partnerId } = req.params;

    if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

    const allMessages = readMessages();

    const conversation = allMessages.filter(m =>
        (m.sender === studentId && m.receiver === partnerId) ||
        (m.sender === partnerId && m.receiver === studentId)
    );

    res.json(conversation);
});

// POST /api/chat/send
router.post('/send', (req, res) => {
    const studentId = req.headers['x-student-id'];
    const { receiverId, text } = req.body;

    if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

    const allMessages = readMessages();
    const newMessage = {
        id: Date.now(),
        sender: studentId,
        receiver: receiverId,
        text,
        timestamp: new Date().toISOString()
    };

    allMessages.push(newMessage);
    writeMessages(allMessages);

    res.json(newMessage);
});

module.exports = router;
