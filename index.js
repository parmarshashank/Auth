const express = require('express');
const app = express();
app.use(express.json());
const users = [];

function generateToken() {
    const opts = ['a', 'b', 'c', 'd', 'e', 's', 's', 'y', 'x', '7', '3', 'y', 'n', 'm', 'j', 'h', 'o', '2', '7'];
    let token = "";
    for (let i = 0; i < 32; i++) {
        token += opts[Math.floor(Math.random() * opts.length)]; // Fixed Math.random call
    }
    return token;
}

app.post('/signup', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (users.find(u => u.username === username)) {
        res.json({ 
            message: "The user already exists",
        });
    } else {
        users.push({
            username: username,
            password: password,
        });
        res.json({ 
            message: "You are signed up",
        });
    }
});

app.post('/signin', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find(u => u.username === username);
    if (user && user.password === password) {
        const token = generateToken();
        user.token = token;
        res.json({
            message: token,
        });
    } else {
        res.status(403).json({ message: "The user does not exist or password is incorrect" }); 
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
