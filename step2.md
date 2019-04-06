Install passport npm install passport passport-jwt jsonwebtoken bcryptjs
Create folder config and file passport.js
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'worsKeptSecret';

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => done(null, null));
    })
  );
};
Initialize passport
app.use(passport.initialize());
require('./config/passport')(passport);
Password hashing
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


5. Login


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
                    keys.secret, { expiresIn: 3600 },
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

mer route
    return res.json({
        "me": req.user
    })
});
 
   
 
