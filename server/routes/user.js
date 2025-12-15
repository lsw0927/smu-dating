const express = require('express');
const router = express.Router();
const { readUsers, writeUsers } = require('../services/db');

// GET /api/user/me
router.get('/me', (req, res) => {
    const studentId = req.headers['x-student-id'];
    if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

    const users = readUsers();
    const user = users.find(u => u.studentId === studentId);

    if (user) {
        const { password, ...userInfo } = user;
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// POST /api/user/schedule
router.post('/schedule', (req, res) => {
    const studentId = req.headers['x-student-id'];
    const { schedule } = req.body; 

    if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

    const users = readUsers();
    const userIndex = users.findIndex(u => u.studentId === studentId);

    if (userIndex !== -1) {
        users[userIndex].schedule = schedule;
        writeUsers(users);
        res.json({ message: 'Schedule updated', schedule: users[userIndex].schedule });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

module.exports = router;
