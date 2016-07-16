var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('doctor-patient');
});

// redirect to login
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tempus' });
})

// Renders doctor page with 1 patient's info
router.get('/doctor', function(req, res, next) {
  if (req.session.isDoctor){
    var name = req.session.currentName;
    var patient = {};
    User.findOne({ username: 'patient1' }, function(err, user) {
      console.log(user);
      patient = user;
      res.render('doctor', { name: name, patient: patient, patientName: patient.name, patientAge: patient.age, patientAddress: patient.address, title: 'Tempus Doctor Portal' });
    });
  } else {
    req.session.accountMessage = "We're sorry, only doctors can view that route"
    res.redirect('../')
  }
})

// Renders patient page with account message
router.get('/patient', function(req, res, next) {
  if (req.session.isPatient){
    res.render('patient', { title: 'Tempus Patient Portal', accountMessage: "Welcome " + req.session.currentName + ", please upload a file"});
  } else {
    req.session.accountMessage = "We're sorry, only patients can view that route"
    res.redirect('../')
  }
})

router.use(express.static(path.join(__dirname, 'public')));



// VVVVVVV Route used for file upload POST, see public/javascripts/uploads.js
router.post('/uploads', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = './uploads';


  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

})

module.exports = router;
