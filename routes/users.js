var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tempus' });
})

router.get('/doctor', function(req, res, next) {
  var name = req.session.currentName;
  var patient = {};
  User.findOne({ username: 'patient1' }, function(err, user) {
    console.log(user);
    patient = user;
    res.render('doctor', { name: name, patient: patient, patientName: patient.name, patientAge: patient.age, patientAddress: patient.address, title: 'Tempus Doctor Portal' });
  });
  console.log("===========================")
  console.log(patient);
  console.log("===========================")

})

router.get('/patient', function(req, res, next) {
  res.render('patient', { title: 'Tempus Patient Portal', accountMessage: "Welcome " + req.session.currentName + ", please upload a file"});
})

router.use(express.static(path.join(__dirname, 'public')));
//
// router.get('/', function(req, res){
//   res.sendFile(path.join(__dirname, 'views/index.html'));
// });

router.post('/uploads', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  // form.uploadDir = path.join(__dirname, '/uploads');
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
