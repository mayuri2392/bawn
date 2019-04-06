const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
const db = 'mongodb+srv://mayuri2305:mayuri@cluster0-mhqo2.mongodb.net/astrolabs?retryWrites=true';

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//init password
app.use(passport.initialize());
require('./config/passport')(passport);

/* GET home page. */
app.get('/', (req, res) => res.json({
    msg: "Hello! Welcome to BAWN(Backend API with NodeJS)"
}));

//Post register
app.post('/register', (req, res) => {

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

//Login
app.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(400).json({ email: "User account does not exist" });
    
        } else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    const payload = { id: user.id, name: user.name };
    
                    // Sign Token
                    jwt.sign(
                        payload,
                        'worstKeptSecret', { expiresIn: 3600 },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token,
                                name: user.name
                            });
                        }
                    );
    
    
                } else {
                    return res.status(400).json({ email: "Passwords is invalid" });
                }
            })
        }
    })
});

// Me route
app.get('/me', passport.authenticate('jwt',{session: false}),(req, res) =>{
    return res.json({"me": req.user})
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
