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
  
   var text=req.body.queryResult['any'];
   var intent =req.body.queryResult.intent.displayName;
   var speech =req.body.queryResult.queryText;
   console.log(`text:`+text);
   console.log(`intent:`+intent);
   console.log(`speech:`+speech);

   
   var response;
   //console.log(`1:`+req.body.queryResult.queryText); //실제 한말
   //console.log(`2:`+req.body.queryResult.intent.displayName); //호출된 인텐트
  if (intent == 'Intent_correct') {
    if (speech == "5") {
      response = 'Correct!';
    }
    else {
      response = 'Incorrect!';
    }
  }

  if (intent == 'Intent_Quiz') {
    response = 'How many member in EDU AI Lab?';
  }

   //console.log(`3:`+req.body.originalDetectIntentRequest.payload.inputs.rawInputs[0].query);
   //console.log(`4:`+req.body.originalDetectIntentRequest.payload.inputs.arguments[0].query);
   

   return res.json({
    fulfillmentText: response,
    source: "example.com",
   });
 
});


app.listen(process.env.PORT || 9696, function() {
  console.log("Server up and 9696 port listening");
});
