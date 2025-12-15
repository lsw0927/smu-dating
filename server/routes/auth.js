const express = require('express');
const router = express.Router();
const { readUsers, writeUsers } = require('../services/db');

// POST /api/auth/signup
router.post('/signup', (req, res) => {
    const { studentId, email, password, name, gender } = req.body;

    if (!studentId || !email || !password || !name || !gender) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const users = readUsers();

    // 유저체크
    if (users.find(u => u.studentId === studentId)) {
        return res.status(400).json({ error: 'Student ID already exists' });
    }

    const newUser = {
        studentId,
        email,
        password, // 원래 보안해야함ㅋㅋㅋ
        name,
        gender,
        schedule: [],
        likes: [],
        matches: []
    };

    users.push(newUser);
    if (writeUsers(users)) {
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } else {
        res.status(500).json({ error: 'Failed to save user' });
    }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log("Login Attempt:", { email, password });

    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password, ...userInfo } = user;
        res.json({ message: 'Login successful', user: userInfo });
    } else {
        res.status(401).json({ error: '입력하신 아이디 비밀번호가 틀렸습니다' });
    }
});

module.exports = router;
