const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.static('public'));
app.use(express.json());

const usersFile = 'users.json';

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    
    // make empty array of users 
    let usersData = { users: [] };

    // Read existing users
    if (fs.existsSync(usersFile)) {
        usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }

    // Check if user exists
    if (usersData.users.some(user => user.username === username)) {
        return res.json({ success: false, message: "Username already exists" });
    }

    // Add new user
    usersData.users.push({ username, password }); // Note: Password should be hashed in a real application
    fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2));
    res.json({ success: true, message: "User created successfully" });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Read existing users
    let usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

    // Check if user exists
    let user = usersData.users.find(u => u.username === username);

    if (user) {
        if (user.failedAttempts >= 5) {
            // Delete user
            usersData.users = usersData.users.filter(u => u.password !== password);
            fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2));
            res.json({ success: false, message: "Account locked and deleted" });
        } else if (user.password === password) {
            // Reset failed attempts on successful login
            user.failedAttempts = 0;
            fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2));
            res.json({ success: true, message: "Login successful" });
        } else {
            // Increment failed attempts
            user.failedAttempts++;
            fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2));
            res.json({ success: false, message: "Incorrect password", attemptsLeft: 5 - user.failedAttempts });
            console.log("Login failed for user:", username, "| Attempts left:", 5 - user.failedAttempts); // Log attempt information
        }
    } else {
        res.json({ success: false, message: "User not found" });
    }
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
