const express = require('express');
const fs = require('fs').promises;
const app = express();
app.use(express.static('public'));
app.use(express.json());
const router = express.Router();
const bodyParser = require("body=parser");
app.use(bodyParser.urlencoded({ extended : true }));

const usersFile = 'users.json';

/*********************************************************
----------------------------------------------------------
--------------------Create New User-----------------------
----------------------------------------------------------
*********************************************************/

async function createUser(username, password, filePath) {
    try {
        let data = await fs.readFile(filePath, 'utf8');
        let jSONuserData = JSON.parse(data);

        // Check if the username already exists
        const userExists = jSONuserData.user.some(userID => userID.username === username);

        if (userExists) {
            console.log(`User '${username}' already exists.`);
            return false;
        }

        // Create a new user object
        const newUser = {
            username: username,
            password: password,
            failedAttempts: 0
        };

        // Add the new user to the JSON data
        jsonData.user.push(newUser);

        // Write the updated JSON data to the file
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 4), 'utf8');
        console.log(`User '${username}' created successfully.`);
        return true;
    } catch (error) {
        console.error('Error reading/writing JSON file:', error);
        return false;
    }
}

/*********************************************************
----------------------------------------------------------
----------------Find User in JSON File--------------------
----------------------------------------------------------
*********************************************************/
async function findUserID(username, filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jSONuserData = JSON.parse(data);
        const userID = jSONuserData.userID.find(userID => userID.username === username);
        return !!userID;
    } 
    catch (error) {
        console.error('Error reading the JSON file:', error);
        return false;
    }
}

/*********************************************************
----------------------------------------------------------
----------------Get Failed Number of Attempts-------------
----------------------------------------------------------
*********************************************************/
async function grabFailedAttempts(username, filepath) {
    try {
        const data = await fs.readFile(filepath, 'utf8');
        const jSONuserData = JSON.parse(data);
        const userID = jSONuserData.userID.find(userID => userID.username === username);
        return userID ? userID.failedAttempts : null;
    }
    catch (error) {
        console.error('Error reading the JSON File:', error);
        return null;
    }
}

/*********************************************************
----------------------------------------------------------
Check Password for User and Update failed Attempts tracker
----------------------------------------------------------
*********************************************************/

async function checkPasswordAttempts (username, password, filePath) {
    try {
        let data = await fs.readFile(filePath, 'utf8');
        let jSONuserData = JSON.parse(data);
        let userID = jSONuserData.userID.find(userID => userID.username === username);

        if (userID) {
            if (userID.password === password) {
                // Reset failed attempts upon successful login
                userID.failedAttempts = 0;
                await fs.writeFile(filePath, JSON.stringify(jSONuserData, null, 4), 'utf8');
                console.log(`Failed attempts for user '${username}' reset successfully.`);
                return true;
            } else {
                userID.failedAttempts++;
                if (userID.failedAttempts >= 5) {
                    // Delete user if failedAttempts reach 5
                    jSONuserData.userID = jSONuserData.userID.filter(u => u.username !== username);
                    await fs.writeFile(filePath, JSON.stringify(jSONuserData, null, 4), 'utf8');
                    console.log(`User '${username}' deleted due to excessive failed attempts.`);
                } else {
                    // Update failed attempts
                    await fs.writeFile(filePath, JSON.stringify(jSONuserData, null, 4), 'utf8');
                    console.log(`Failed attempts for user '${username}' incremented successfully.`);
                }
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error reading and or writing JSON file:', error);
        return false;
    }
}

/*********************************************************
----------------------------------------------------------
--------Redirection block based on function results-------
----------------------------------------------------------
*********************************************************/

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get('/mainpage', (req, res) => {
    res.json("Successful Login Credentials");
});

app.get('*', (req, res) => {
    res.json("page not found");
});

app.listen(8080, () => {
    console.log("App is starting at port ", 8080);
});

/*********************************************************
----------------------------------------------------------
-------------------Login Data chunk-----------------------
----------------------------------------------------------
*********************************************************/

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const userFound = await findUserID(username, jsonFilePath);
        if (userFound) {
            const passwordCorrect = await checkPasswordAttempts(username, password, jsonFilePath);
            if (passwordCorrect) {
                res.json({ success: true, message: 'Login successful' });
            } else {
                const failedAttempts = await grabFailedAttempts(username, jsonFilePath);
                res.json({ success: false, message: `Incorrect password: ${failedAttempts}` });
            }
        } else {
            res.json({ success: false, message: 'Username not found' });
        }
    } catch (error) {
        console.error('Error processing login:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/*********************************************************
----------------------------------------------------------
------------------SignUp Data chunk-----------------------
----------------------------------------------------------
*********************************************************/

app.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const userFound = await findUserID(username, jsonFilePath);
        if (userFound) {
            res.json({ success: false, message: 'Username Taken' });
        } else {
            createUser(username, password, jsonFilePath)
                .then(success => {
                    if (success) {
                        console.log("User created successfully!");
                        res.json({ success: true, message: 'User Created' });
                    } else {
                        // console.log("Username Taken");
                        res.json({ success: false, message: 'Username Taken' });
                    }
                })
                .catch(error => {
                    console.error("Error creating user:", error);
                    res.json({ success: false, message: 'Error creating user' });
                });
        }
    } catch (error) {
        console.error('Error processing signup:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});









//Disregard for now

/*

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
            usersData.users = usersData.users.filter(u => u.username !== username);
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
}); */
