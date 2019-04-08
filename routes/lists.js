const express = require('express');
const passport = require('passport');
const Task = require('../models/Task');
const List = require('../models/List');

const router = express.Router();

//Create a new todo list of logged in user
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    new List({
    	name: req.body.name,
    	user: req.user,
    	tasks: []
    })
    .save()
    .then(list => res.json({id: list.id}))
    .catch(err => console.log(err));
});


module.exports = router;