var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post("/echo", function(req, res) {
  //var body = JSON.stringify(req.body);
/*
var speech =
  req.body.result &&
  req.body.result.parameters &&
  req.body.result.parameters.echoText
    ? req.body.result.parameters.echoText
    : "Seems like some problem. Speak again.";
    */

   console.log(` /echo post!`);
   //console.log(`req.body:`+ body);
   console.log(`req.body:`+req.body);


   var speech = 'How many member in EDU AI Lab?';

   return res.json({
    fulfillmentText: speech,
    source: "example.com",
   });
 
});


app.listen(process.env.PORT || 9696, function() {
  console.log("Server up and 9696 port listening");
});
