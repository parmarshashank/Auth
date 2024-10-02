const express = require('express');
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const users = [];
const JWT_SECRET = "thisisarandomjwtsecretkey"
// function generateToken() {
//     const opts = ['a', 'b', 'c', 'd', 'e', 's', 's', 'y', 'x', '7', '3', 'y', 'n', 'm', 'j', 'h', 'o', '2', '7'];
//     let token = "";
//     for (let i = 0; i < 32; i++) {
//         token += opts[Math.floor(Math.random() * opts.length)]; 
//     }
//     return token;
// }
function authMiddleWare(req, res, next){
    const token= req.headers.token;
    const decodedInformation= jwt.verify(token, JWT_SECRET, (err, decoded)=>{
        if(err){
            res.status(401).send({
                message:"unauthorized",
            })
        }
        else{
            req.user = decoded;
            next();
        }
    }); 

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
        const token = jwt.sign({
            username: username
        }, JWT_SECRET);
        // user.token = token;
        //No need to store the token in the db as it is itself stateless
        res.json({
            token: token,
        });
    } else {
        res.status(403).json({ message: "The user does not exist or password is incorrect" }); 
    }
});
app.use(authMiddleWare);
app.get("/me", function(req, res){
    // const token= req.headers.token;
    // const decodedInformation= jwt.verify(token, JWT_SECRET); //{ username: "snfjksnfjk"} converting jwt to the username
    // const username= decodedInformation.username;
    
    // const user= users.find((u)=>u.username===username);
    // if(user){
    //     res.json({
    //         username: user.username,
    //         password: user.password
    //     });
    // }
    // else{
    //     res.json({
    //         message:"token invalid",
    //     })
    // }
    const user= req.user;
    res.send({
        username: user.username,
        password: user.password,
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
