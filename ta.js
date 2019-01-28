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

app.post("/allintent", function(req, res) {
   var intent =req.body.queryResult.intent.displayName;
   var speech =req.body.queryResult.queryText;
   var aim =req.body.queryResult.parameters['any'];
   console.log(`intent:`+intent);
   console.log(`speech:`+speech);
   console.log(`aim:`+aim);
   
   var response='default';
   //console.log(`1:`+req.body.queryResult.queryText); //실제 한말
   //console.log(`2:`+req.body.queryResult.intent.displayName); //호출된 인텐트
  if (intent== 'Default Welcome Intent'){
    response='Welcome to simple test! do you want to play something?';
  }

  //<speak><audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>
  //var audio1 = `<audio src="https://s3.amazonaws.com/eduai/common/common-003-correct-good.mp3"/>`;
  if (intent == 'Answer') {
   // if(speech)response = `<speak>hi audio test! number 1. ${audio1} ${audio1} ${audio1} ${audio1} ${audio1} ${audio1} ${audio1}</speak> `;
    if(speech) response ='<speak>'+speech+'. say anything!'+'</speak>';

   // "<speak> <audio src='https://s3.amazonaws.com/eduai/sw01/u01/p01/sw01-u01-p01-001-wp-title.mp3'>did not get your audio file</audio> you said that "+speech+". say anything!<speak>";
    else response ='say anything!';
  }
  
    

   return res.json({
    fulfillmentText: response,
    source: "example.com",
   });
 
});


app.listen(process.env.PORT || 9696, function() {
  console.log("Server up and 9696 port listening");
});
