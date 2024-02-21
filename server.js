const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.static('public'));
app.use(express.json());

const usersFile = 'users.json';

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    
    // Read existing users
    let users = {};
    if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }

    // Check if user exists
    if (users[username]) {
        return res.json({ success: false, message: "Username already exists" });
    }

    // Add new user
    users[username] = password; // Note: Password should be hashed in a real application
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.json({ success: true, message: "User created successfully" });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
