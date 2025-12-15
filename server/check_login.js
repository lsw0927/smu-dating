const { readUsers } = require('./services/db');

const email = 'admin@uni.edu';
const password = 'pass';

console.log("Reading users...");
const users = readUsers();
console.log("Users found:", users.length);

const user = users.find(u => u.email === email && u.password === password);

if (user) {
    console.log("SUCCESS: Login logic works. User found:", user.email);
} else {
    console.log("FAILURE: User not found with credentials:", email, password);
    console.log("Dump of users:", JSON.stringify(users, null, 2));
}
