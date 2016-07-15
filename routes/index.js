var express = require('express');
var router = express.Router();
var User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tempus', accountMessage: req.session.accountMessage });
})

// GET logout
.get('/logout', function(req, res, next) {
  if (req.session.loggedIn === true) {
    req.session.loggedIn = null;
    req.session.currentUserId = null;
    req.session.currentUser = null;
    req.session.accountMessage = "You have been logged out";
    console.log('You have been logged out.');
    res.redirect('/');
  } else {
    res.redirect('/');
  }
})

// ------------------ GET login ---------------------------
.get('/login', function(req, res, next) {
  if (req.session.loggedIn === true) {
    console.log("You're already logged in!");
    req.session.accountMessage = "You're already logged in!";
    User.findOne({ _id: req.session.currentUserId }, function(err, user) {
      if (user.isDoctor) {
        res.redirect('/users/doctor');
      } else {
        res.redirect('/users/patient');
      }
    })
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
        req.session.currentName = user.name;
        var currentUser = user.username;
        console.log("Welcome to the site, "+ currentUser);
        if (user.isDoctor) {
          res.redirect('/users/doctor');
        } else {
          res.redirect('/users/patient');
        }
      } else {
          req.session.accountMessage = "That is an incorrect password for " + user.username + ", please try again";
          console.log("The username or password you entered was incorrect.");
          res.redirect('/');
      }
    } else {
        req.session.accountMessage = "Sorry, that username was not found."
        console.log("User doesn't exist.");
        res.redirect('/');
      }
  });
})

module.exports = router;
