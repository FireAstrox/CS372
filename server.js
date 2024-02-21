const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.static('public'));
app.use(express.json());

const usersFile = 'users.json';

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    
    
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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
