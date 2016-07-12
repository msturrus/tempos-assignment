var express = require('express');
var router = express.Router();
var User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tempus' });
});

// ------------------ GET login ---------------------------
.get('/login', function(req, res, next) {
  if (req.session.loggedIn === true) {
    console.log("You're already logged in!");
    res.redirect('/');
  } else res.render('index', { title: 'Tempus'});
}) // ------------------ POST login --------------------------
.post('/login', function(req, res, next) {
  User.findOne({ username: req.body.username }, function(err, user) {
    if (user) {
      var enteredPassword = req.body.password;
      // var comparison = bcrypt.compareSync(enteredPassword, user.passwordHash);
      if (enteredPassword === user.password) {
        req.session.loggedIn = true;
        req.session.currentUserId = user._id;
        req.session.currentUser = user.username;
        var currentUser = user.username;
        console.log("Welcome to the site, "+ currentUser);
        if (user.isDoctor) {
          res.redirect('/doctor');
        } else {
          res.redirect('/patient');
        }
      } else {
          console.log("The username or password you entered was incorrect.");
          res.redirect('/login');
      }
    } else {
        console.log("User doesn't exist.");
        res.redirect('/register');
      }
  });
})

module.exports = router;
