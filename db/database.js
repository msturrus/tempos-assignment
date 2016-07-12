var mongoose = require('mongoose');

var connectionString = "mongodb://tempus:tempus@ds031948.mlab.com:31948/tempus";
// var connectionString = process.env.DB;

// console.log(process.env.DB);
// mongodb://tempus:tempus@ds031948.mlab.com:31948/tempus
// mongodb://tempusuiassignment:password1@ds031948.mlab.com:31948/tempus



mongoose.connect(connectionString);

mongoose.connection.on('connected', function() {
  console.log('Mongoose is connected to: ' + connectionString);
});

mongoose.connection.on('error', function(error) {
  console.log('Mongoose has encounted an error: '+ error);
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected from: '+ connectionString);
});
