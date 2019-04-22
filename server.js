const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('./config/keys');

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
const db= keys.mongoURI;

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

const userRouter = require('./routes/users');
app.use('/users',userRouter);

const listRouter = require('./routes/lists');
app.use('/users/lists',listRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
