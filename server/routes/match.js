const express = require('express');
const router = express.Router();
const { readUsers, writeUsers } = require('../services/db');

const hasSharedClass = (scheduleA, scheduleB) => {
    return scheduleA.some(classA =>
        scheduleB.some(classB =>
            classA.className === classB.className &&
            classA.day === classB.day &&
            classA.time === classB.time
        )
    );
};

// schedule 구조: { className, day, time }
const courseKey = (c) => `${c.className || ""}_${c.day || ""}_${c.time || ""}`;

const getSharedCourses = (mySchedule = [], otherSchedule = []) => {
  const mySet = new Set(mySchedule.map(courseKey));
  return otherSchedule.filter((c) => mySet.has(courseKey(c)));
};




// GET /api/match/recommendations
router.get('/recommendations', (req, res) => {
  const studentId = req.headers['x-student-id'];
  if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

  const users = readUsers();
  const currentUser = users.find(u => u.studentId === studentId);
  if (!currentUser) return res.status(404).json({ error: 'User not found' });

  const myGender = currentUser.gender?.trim();
  if (!myGender) return res.status(400).json({ error: 'Current user gender missing' });

  const recommendations = users
    .filter(u => {
      if (u.studentId === currentUser.studentId) return false;
      if (currentUser.matches?.includes(u.studentId)) return false;

      const userGender = u.gender?.trim();
      if (!userGender) return false;
      if (userGender === myGender) return false;

      return hasSharedClass(currentUser.schedule, u.schedule);
    })
    .map(u => {
      const { password, ...info } = u;

      const sharedCourses = getSharedCourses(currentUser.schedule, u.schedule).map(c => ({
        className: c.className,
        day: c.day,
        time: c.time
      }));

      return { ...info, sharedCourses };
    });

  res.json(recommendations);
});



// POST /api/match/like
router.post('/like', (req, res) => {
    const studentId = req.headers['x-student-id'];
    const { targetId } = req.body;

    if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

    const users = readUsers();
    const currentUserIndex = users.findIndex(u => u.studentId === studentId);
    const targetUserIndex = users.findIndex(u => u.studentId === targetId);

    if (currentUserIndex === -1 || targetUserIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const currentUser = users[currentUserIndex];
    const targetUser = users[targetUserIndex];

    if (!currentUser.likes.includes(targetId)) {
        currentUser.likes.push(targetId);
    }

    let isMatch = false;
    if (targetUser.likes.includes(studentId)) {
        isMatch = true;
        if (!currentUser.matches.includes(targetId)) currentUser.matches.push(targetId);
        if (!targetUser.matches.includes(studentId)) targetUser.matches.push(studentId);
    }

    writeUsers(users);

    res.json({ message: 'Liked', isMatch });
});

// GET /api/match/matches
router.get('/matches', (req, res) => {
    const studentId = req.headers['x-student-id'];
    if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

    const users = readUsers();
    const currentUser = users.find(u => u.studentId === studentId);

    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    const matches = users.filter(u => currentUser.matches.includes(u.studentId))
        .map(u => {
            const { password, ...info } = u;
            return info;
        });

    res.json(matches);
});

module.exports = router;
